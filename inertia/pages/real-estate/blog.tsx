import { Head, Link, router } from '@inertiajs/react'
import type { BlogPost } from '@/lib/real-estate-types'
import BlogCard from '@/components/blog-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface BlogPageProps {
  posts: {
    data: BlogPost[]
    meta: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
  filters: {
    category: string | null
    tag: string | null
  }
  categories: string[]
}

export default function BlogPage({ posts, filters, categories }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
  }

  return (
    <>
      <Head title="Blog - Realest" />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Real Estate Blog</h1>
              <p className="text-slate-600">
                Insights, tips, and news about the real estate market
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </form>
              
              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !filters.category
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        filters.category === category
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Posts */}
            {posts.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {posts.data.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {posts.meta.lastPage > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: posts.meta.lastPage }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/blog?page=${page}${filters.category ? `&category=${encodeURIComponent(filters.category)}` : ''}`}
                        className={`px-4 py-2 rounded-md ${
                          page === posts.meta.currentPage
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        } transition-colors`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No blog posts found.</p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
