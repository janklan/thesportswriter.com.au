import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../../components/Layout'
import BasicMeta from '../../../components/meta/BasicMeta'
import OpenGraphMeta from '../../../components/meta/OpenGraphMeta'
import PostList from '../../../components/PostList'
import config from '../../../lib/config'
import { countPosts, listPostContent, PostContent } from '../../../lib/posts'
import { getTag, listTags, TagContent } from '../../../lib/tags'
import Navigation from '../../../components/Navigation'
import Pagination from '../../../components/Pagination'
import Breadcrumb from '../../../components/Breadcrumb'

type Props = {
  posts: PostContent[];
  tag: TagContent;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index ({ posts, tag, pagination, page }: Props) {
  const url = `/archive/tags/${tag.name}` + (page ? `/${page}` : '')
  const title = tag.name
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <Navigation />

      <div className="container max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-300">
          <Breadcrumb href="/archive">Archive</Breadcrumb>
          {' / '}
          <Breadcrumb>{title}</Breadcrumb>
        </h1>
        <div className="mb-16">
          <PostList posts={posts} />
        </div>
        { pagination &&
        <Pagination
          current={pagination.current}
          pages={pagination.pages}
          link={{
            href: () => '/archive/tags/[[...slug]]',
            as: (page) =>
              page === 1
                ? '/archive/tags/' + tag.slug
                : `/archive/tags/${tag.slug}/${page}`
          }}
        />
      }
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queries = params.slug as string[]
  const [slug, page] = [queries[0], queries[1]]
  const posts = listPostContent(
    page ? parseInt(page as string) : 1,
    config.posts_per_page,
    slug
  )
  const tag = getTag(slug)
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil(countPosts(slug) / config.posts_per_page)
  }
  const props: {
    posts: PostContent[];
    tag: TagContent;
    pagination: { current: number; pages: number };
    page?: string;
  } = { posts, tag, pagination }
  if (page) {
    props.page = page
  }
  return {
    props
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = listTags().flatMap((tag) => {
    const pages = Math.ceil(countPosts(tag.slug) / config.posts_per_page)
    return Array.from(Array(pages).keys()).map((page) =>
      page === 0
        ? {
            params: { slug: [tag.slug] }
          }
        : {
            params: { slug: [tag.slug, (page + 1).toString()] }
          }
    )
  })
  return {
    paths: paths,
    fallback: false
  }
}
