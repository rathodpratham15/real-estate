import { Head, Link } from '@inertiajs/react'
import type { BlogPost } from '@/lib/real-estate-types'
import BlogCard from '@/components/blog-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Calendar, ArrowLeft } from 'lucide-react'

interface BlogPostPageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
      <Head title={`${post.title} - Realest Blog`} />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          {/* Hero Image */}
          {post.featuredImage && (
            <div className="relative h-[400px] md:h-[500px] bg-slate-200">
              <img loading="lazy" decoding="async"
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>

            <article className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                {post.category && (
                  <span className="inline-block text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                
                {post.excerpt && (
                  <p className="text-xl text-slate-600 mb-6">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt?.toString() || null)}</span>
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
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Bio */}
              {post.author && (
                <div className="border-t border-slate-200 pt-8 mb-12">
                  <div className="flex items-start gap-4">
                    {post.author.photo ? (
                      <img loading="lazy" decoding="async"
                        src={post.author.photo}
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-600 font-semibold">
                          {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {post.author.firstName} {post.author.lastName}
                      </h3>
                      {post.author.bio && (
                        <p className="text-slate-600">{post.author.bio}</p>
                      )}
                      {post.author.yearsOfExperience && (
                        <p className="text-sm text-slate-500 mt-2">
                          {post.author.yearsOfExperience} years of experience
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
