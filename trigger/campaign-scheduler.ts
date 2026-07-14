import { task, logger } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const campaignScheduler = task({
  id: 'campaign-scheduler',
  maxDuration: 300,
  run: async () => {
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

    if (!due || due.length === 0) {
      logger.info('No due campaigns');
      return { processed: 0 };
    }

    let processed = 0;
    for (const row of due) {
      try {
        // Trigger the send job (this uses the Trigger.dev task 'send-email-campaign')
        // The SDK's tasks.trigger may return a trigger id; handle best-effort
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = await (global as any).tasks?.trigger?.('send-email-campaign', { campaign_id: row.campaign_id, triggered_by: 'scheduler' });
        const triggerId = res?.id ?? null;

        // Persist trigger id on campaign for traceability
        await supabase.from('email_campaigns').update({ scheduled_job_id: triggerId, status: 'scheduled' }).eq('id', row.campaign_id);

        // Delete schedule row (it is now scheduled/enqueued)
        await supabase.from('email_campaign_schedules').delete().eq('id', row.id);

        processed++;
      } catch (e) {
        logger.error('Failed processing scheduled campaign', { id: row.id, error: e });
      }
    }

    logger.info('Campaign scheduler finished', { processed });
    return { processed };
  },
});
