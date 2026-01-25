import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import type { BlogPost } from '@/lib/real-estate-types'
import BlogCard from '@/components/blog-card'
import Navbar from '@/components/navbar-new'
import Footer from '@/components/footer-new'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

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
    router.get('/blog', { search: searchTerm }, { preserveState: true })
  }

  return (
    <>
      <Head title="Blog - Realest" />

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <div
          className="pt-24 pb-16 px-6"
          style={{
            background: 'linear-gradient(180deg, #A8D5E2 0%, #ffffff 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}
              >
                Blog
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
                Explore Our Latest Blogs
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Insights, tips, and news about the real estate market
              </p>
            </motion.div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </form>

              {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !filters.category
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    All
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.category === category
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {posts.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.data.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {posts.meta.lastPage > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: posts.meta.lastPage }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/blog?page=${page}${filters.category ? `&category=${encodeURIComponent(filters.category)}` : ''}`}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          page === posts.meta.currentPage
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No blog posts found.</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
