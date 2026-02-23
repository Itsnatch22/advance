'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Video, 
  FileText,
  Clock,
  Users,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'blog' | 'case-study' | 'webinar' | 'download';
  image?: string;
  author?: string;
  date: string;
  readTime?: string;
  tags: string[];
  link?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

// Sample data
const resources: Resource[] = [
  // Guides
  {
    id: 'guide-1',
    title: 'Getting Started with Earned Wage Access: A Complete Setup Guide',
    description: 'Learn how to implement EWA in your organization across East Africa. Step-by-step instructions for HR teams, payroll integration, and employee onboarding.',
    category: 'guide',
    image: '/images/resources/guide-setup.jpg',
    author: 'Sarah Kimani',
    date: '2026-02-15',
    readTime: '8 min',
    tags: ['Setup', 'HR', 'Implementation'],
    link: '/resources/guides/ewa-setup-guide'
  },
  {
    id: 'guide-2',
    title: 'Budgeting Tips for East African Employees',
    description: 'Practical budgeting strategies tailored for Kenya, Uganda, Tanzania, and Rwanda. Manage mobile money, plan for school fees, and build emergency savings.',
    category: 'guide',
    image: '/images/resources/guide-budgeting.jpg',
    author: 'David Omondi',
    date: '2026-02-10',
    readTime: '6 min',
    tags: ['Budgeting', 'Financial Wellness', 'Savings'],
    link: '/resources/guides/budgeting-tips'
  },
  {
    id: 'guide-3',
    title: 'Understanding EWA Regulations in Kenya',
    description: 'Navigate Kenya\'s financial regulations, Central Bank guidelines, and employment law considerations when implementing earned wage access programs.',
    category: 'guide',
    image: '/images/resources/guide-regulations-kenya.jpg',
    author: 'Jane Wanjiru',
    date: '2026-02-08',
    readTime: '10 min',
    tags: ['Regulations', 'Kenya', 'Compliance'],
    link: '/resources/guides/kenya-regulations'
  },
  {
    id: 'guide-4',
    title: 'EWA Compliance in Uganda and Tanzania',
    description: 'Comprehensive overview of regulatory requirements in Uganda and Tanzania, including Bank of Uganda guidelines and Tanzania labor laws.',
    category: 'guide',
    image: '/images/resources/guide-regulations-ug-tz.jpg',
    author: 'Emmanuel Mutesi',
    date: '2026-02-05',
    readTime: '9 min',
    tags: ['Regulations', 'Uganda', 'Tanzania', 'Compliance'],
    link: '/resources/guides/uganda-tanzania-compliance'
  },
  {
    id: 'guide-5',
    title: 'Maximizing Employee Adoption of EWA Benefits',
    description: 'Proven strategies to drive awareness and adoption of earned wage access among your workforce. Communication templates and training materials included.',
    category: 'guide',
    image: '/images/resources/guide-adoption.jpg',
    author: 'Grace Mukasa',
    date: '2026-02-01',
    readTime: '7 min',
    tags: ['Employee Engagement', 'Change Management', 'Communication'],
    link: '/resources/guides/employee-adoption'
  },
  
  // Blog posts
  {
    id: 'blog-1',
    title: 'How EWA is Reducing Financial Stress Among African Workers',
    description: 'New research shows 73% of employees report lower financial anxiety after adopting earned wage access. Explore the transformative impact across East Africa.',
    category: 'blog',
    image: '/images/resources/blog-financial-stress.jpg',
    author: 'Dr. Amina Hassan',
    date: '2026-02-18',
    readTime: '5 min',
    tags: ['Financial Wellness', 'Research', 'Impact'],
    link: '/blog/reducing-financial-stress'
  },
  {
    id: 'blog-2',
    title: 'The Rise of FinTech in East Africa: EWA Leading the Way',
    description: 'From M-Pesa to earned wage access, discover how East Africa continues to pioneer financial innovation and why EWA is the next frontier.',
    category: 'blog',
    image: '/images/resources/blog-fintech-rise.jpg',
    author: 'Michael Ndungu',
    date: '2026-02-12',
    readTime: '6 min',
    tags: ['FinTech', 'Innovation', 'East Africa'],
    link: '/blog/fintech-east-africa'
  },
  {
    id: 'blog-3',
    title: 'Mobile Money Integration: Making EWA Accessible Across Africa',
    description: 'How seamless M-Pesa, Airtel Money, and MTN Mobile Money integration is democratizing financial flexibility for millions of workers.',
    category: 'blog',
    image: '/images/resources/blog-mobile-money.jpg',
    author: 'Patricia Otieno',
    date: '2026-02-09',
    readTime: '4 min',
    tags: ['Mobile Money', 'Technology', 'Accessibility'],
    link: '/blog/mobile-money-integration'
  },
  {
    id: 'blog-4',
    title: 'Employer Benefits: Why Top Companies are Adopting EWA',
    description: 'Retention up 32%, absenteeism down 41%. Learn why leading employers across Kenya, Uganda, Tanzania, and Rwanda are implementing EWA.',
    category: 'blog',
    image: '/images/resources/blog-employer-benefits.jpg',
    author: 'John Kamau',
    date: '2026-02-06',
    readTime: '5 min',
    tags: ['Employer Benefits', 'HR', 'Retention'],
    link: '/blog/employer-benefits-ewa'
  },
  {
    id: 'blog-5',
    title: 'Financial Inclusion: Bridging the Gap for Unbanked Workers',
    description: 'Over 60% of workers in East Africa remain underbanked. Discover how EWA is creating pathways to financial services for millions.',
    category: 'blog',
    image: '/images/resources/blog-financial-inclusion.jpg',
    author: 'Fatuma Mohammed',
    date: '2026-02-03',
    readTime: '7 min',
    tags: ['Financial Inclusion', 'Impact', 'Accessibility'],
    link: '/blog/financial-inclusion'
  },
  {
    id: 'blog-6',
    title: 'The Psychology of Payday: Why Bi-weekly Isn\'t Working',
    description: 'Behavioral economics research reveals why traditional pay cycles increase stress and debt. The science behind on-demand pay.',
    category: 'blog',
    image: '/images/resources/blog-psychology.jpg',
    author: 'Dr. Robert Mwangi',
    date: '2026-01-28',
    readTime: '6 min',
    tags: ['Research', 'Behavioral Economics', 'Employee Wellness'],
    link: '/blog/psychology-of-payday'
  },
  
  // Case Studies
  {
    id: 'case-1',
    title: 'SafariCom Retail: 45% Reduction in Employee Turnover',
    description: 'How Kenya\'s leading telecom retailer transformed employee retention and satisfaction with EazWage.',
    category: 'case-study',
    image: '/images/resources/case-safaricom.jpg',
    date: '2026-02-14',
    tags: ['Retail', 'Kenya', 'Retention'],
    link: '/resources/case-studies/safaricom-retail',
    metrics: [
      { label: 'Turnover Reduction', value: '45%' },
      { label: 'Employee Satisfaction', value: '+38%' },
      { label: 'Productivity Increase', value: '22%' }
    ]
  },
  {
    id: 'case-2',
    title: 'East Africa Breweries: Boosting Manufacturing Productivity',
    description: 'A regional manufacturing leader increases output and reduces absenteeism across three countries with earned wage access.',
    category: 'case-study',
    image: '/images/resources/case-manufacturing.jpg',
    date: '2026-02-07',
    tags: ['Manufacturing', 'Multi-country', 'Productivity'],
    link: '/resources/case-studies/east-africa-breweries',
    metrics: [
      { label: 'Absenteeism Down', value: '41%' },
      { label: 'Output Increase', value: '18%' },
      { label: 'ROI', value: '340%' }
    ]
  },
  {
    id: 'case-3',
    title: 'Nairobi Hospital Group: Healthcare Worker Financial Wellness',
    description: 'Empowering frontline healthcare workers with financial flexibility during demanding shifts and emergency situations.',
    category: 'case-study',
    image: '/images/resources/case-healthcare.jpg',
    date: '2026-01-30',
    tags: ['Healthcare', 'Kenya', 'Employee Wellness'],
    link: '/resources/case-studies/nairobi-hospital',
    metrics: [
      { label: 'Financial Stress', value: '-67%' },
      { label: 'Staff Retention', value: '+52%' },
      { label: 'Patient Satisfaction', value: '+15%' }
    ]
  },
  
  // Webinars
  {
    id: 'webinar-1',
    title: 'Future of Work in East Africa: EWA & Financial Wellness',
    description: 'Join industry experts for insights on the evolving workplace benefits landscape across Kenya, Uganda, Tanzania, and Rwanda.',
    category: 'webinar',
    image: '/images/resources/webinar-future.jpg',
    date: '2026-03-15',
    tags: ['Future of Work', 'Panel Discussion', 'Regional Trends'],
    link: '/resources/webinars/future-of-work'
  },
  {
    id: 'webinar-2',
    title: 'EWA Implementation Masterclass for HR Leaders',
    description: 'A practical workshop covering technical setup, change management, and measuring ROI. Limited to 50 attendees.',
    category: 'webinar',
    image: '/images/resources/webinar-hr.jpg',
    date: '2026-03-22',
    tags: ['HR', 'Implementation', 'Masterclass'],
    link: '/resources/webinars/hr-masterclass'
  },
  
  // Downloads
  {
    id: 'download-1',
    title: 'Interactive Wage Calculator',
    description: 'Calculate potential earnings access and understand how EWA works for your pay schedule. Built for East African salary structures.',
    category: 'download',
    image: '/images/resources/download-calculator.jpg',
    date: '2026-02-20',
    tags: ['Calculator', 'Tool', 'Planning'],
    link: '/resources/tools/wage-calculator'
  },
  {
    id: 'download-2',
    title: 'EWA Implementation Checklist (PDF)',
    description: 'Comprehensive 12-page guide covering technical requirements, stakeholder alignment, and go-live steps.',
    category: 'download',
    date: '2026-02-15',
    tags: ['Template', 'Implementation', 'Checklist'],
    link: '/downloads/ewa-implementation-checklist.pdf'
  },
  {
    id: 'download-3',
    title: 'Employee Communication Templates',
    description: 'Ready-to-use email templates, posters, and FAQs in English and Swahili to announce EWA to your workforce.',
    category: 'download',
    date: '2026-02-10',
    tags: ['Templates', 'Communication', 'Swahili'],
    link: '/downloads/communication-templates.zip'
  },
  {
    id: 'download-4',
    title: 'Financial Wellness Guide for Employees (PDF)',
    description: 'A beautifully designed 20-page guide covering budgeting, savings, and smart use of EWA. Available in 4 languages.',
    category: 'download',
    date: '2026-02-05',
    tags: ['Guide', 'Financial Literacy', 'Multilingual'],
    link: '/downloads/financial-wellness-guide.pdf'
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: BookOpen },
  { id: 'guide', label: 'Guides', icon: FileText },
  { id: 'blog', label: 'Blog', icon: TrendingUp },
  { id: 'case-study', label: 'Case Studies', icon: Users },
  { id: 'webinar', label: 'Webinars', icon: Video },
  { id: 'download', label: 'Downloads', icon: Download }
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach(resource => {
      resource.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        resource.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => resource.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white text-white">
        <div className="absolute inset-0 bg-[url('/images/patterns/circuit.svg')] opacity-10" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100">
              Financial Wellness Resources
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Empowering employees and employers across East Africa with insights, tools, and guidance for earned wage access
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guides, articles, case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by topic:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 12).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-600'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> resources
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="ml-2 text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          {filteredResources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ resource, index }: { resource: Resource; index: number }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'guide':
        return 'bg-blue-100 text-blue-700';
      case 'blog':
        return 'bg-purple-100 text-purple-700';
      case 'case-study':
        return 'bg-green-100 text-green-700';
      case 'webinar':
        return 'bg-orange-100 text-orange-700';
      case 'download':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'guide':
        return <FileText className="w-4 h-4" />;
      case 'blog':
        return <TrendingUp className="w-4 h-4" />;
      case 'case-study':
        return <Users className="w-4 h-4" />;
      case 'webinar':
        return <PlayCircle className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 bg-linear-to-br from-blue-100 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-10">
            {getCategoryIcon(resource.category)}
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
            {getCategoryIcon(resource.category)}
            {resource.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Metrics (for case studies) */}
        {resource.metrics && (
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
            {resource.metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{metric.value}</p>
                <p className="text-xs text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(resource.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          {resource.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resource.readTime}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={resource.link || '#'}
          className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all group/link"
        >
          {resource.category === 'download' ? 'Download' : resource.category === 'webinar' ? 'Register' : 'Read More'}
          <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ResourcesPage;