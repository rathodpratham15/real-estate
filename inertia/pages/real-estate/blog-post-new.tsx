import { Head, Link } from '@inertiajs/react'
import type { BlogPost } from '@/lib/real-estate-types'
import BlogCard from '@/components/blog-card'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Calendar, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface BlogPostPageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const formatDate = (date: string | { toFormat: (format: string) => string } | null) => {
    if (!date) return ''
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
    // Handle Luxon DateTime object
    if (date && typeof date === 'object' && 'toFormat' in date) {
      return date.toFormat('MMMM d, yyyy')
    }
    return ''
  }

  return (
    <>
      <Head title={`${post.title} - Realest Blog`} />

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Image */}
        {post.featuredImage && (
          <div className="relative h-[400px] md:h-[500px] bg-gray-200">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.category && (
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                >
                  {post.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{post.title}</h1>

              {post.excerpt && <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>}

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || null)}</span>
                </div>
                {post.author && (
                  <>
                    <span>•</span>
                    <span>
                      By {post.author.firstName} {post.author.lastName}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              className="prose prose-lg max-w-none mb-12 text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Author Bio */}
            {post.author && (
              <motion.div
                className="border-t border-gray-200 pt-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  {post.author.photo ? (
                    <img
                      src={post.author.photo}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A8D5E2' }}>
                      <span className="text-black font-semibold">
                        {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-black">
                      {post.author.firstName} {post.author.lastName}
                    </h3>
                    {post.author.bio && <p className="text-gray-600">{post.author.bio}</p>}
                    {post.author.yearsOfExperience && (
                      <p className="text-sm text-gray-500 mt-2">
                        {post.author.yearsOfExperience} years of experience
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-black">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}
