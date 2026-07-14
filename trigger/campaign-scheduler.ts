import { task, logger } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';
import { sendEmailCampaign } from './campaign-send';
import { logAdminAction } from '@/lib/admin/audit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const campaignScheduler = task({
  id: 'campaign-scheduler',
  maxDuration: 300,
  run: async () => {
    const startedAt = Date.now();
    logger.info('Campaign scheduler starting');
    const now = new Date().toISOString();
    // Find due schedules
    const { data: due, error } = await supabase
      .from('email_campaign_schedules')
      .select('id, campaign_id, scheduled_at')
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(50);

    if (error) {
      logger.error('Scheduler DB query failed', { error });
      throw error;
    }

    const queueLength = due?.length ?? 0;

    if (queueLength === 0) {
      logger.info('No due campaigns');
      return { processed: 0, queueLength: 0, durationMs: Date.now() - startedAt };
    }

    let processed = 0;
    let failed = 0;
    for (const row of due!) {
      try {
        const handle = await sendEmailCampaign.trigger({
          campaign_id: row.campaign_id,
          triggered_by: 'scheduler',
        });

        // Persist trigger id on campaign for traceability
        await supabase.from('email_campaigns').update({ scheduled_job_id: handle.id, status: 'scheduled' }).eq('id', row.campaign_id);

        // Delete schedule row (it is now scheduled/enqueued)
        await supabase.from('email_campaign_schedules').delete().eq('id', row.id);

        processed++;
      } catch (e) {
        failed++;
        logger.error('Failed processing scheduled campaign', { id: row.id, error: e });
      }
    }

    const durationMs = Date.now() - startedAt;
    logger.info('Campaign scheduler finished', { processed, failed, queueLength, durationMs });

    if (failed > 0) {
      await logAdminAction(null, 'scheduler.run_with_failures', {
        objectType: 'campaign_scheduler',
        meta: { processed, failed, queueLength, durationMs },
      });
    }

    return { processed, failed, queueLength, durationMs };
  },
});
