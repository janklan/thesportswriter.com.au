import { PostContent } from '../lib/posts'
import Date from './Date'
import { parseISO } from 'date-fns'

/**
 * Deprecated, removal pending.
 *
 * The customer requested to always show a hero image, so the FeaturedPostItem
 *  was turn into a PostItemWithHeroImage and this one was no longer used.
 */

type Props = {
  post: PostContent;
};
export default function PostItem ({ post }: Props) {
  return (
    <div className="group">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <Date date={parseISO(post.date)} />
      </p>
      <a href={'/article/' + post.slug} className="mt-2 block">
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-300 group-hover:underline">
          {post.title}
        </p>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          {post.articleSummary}
        </p>
      </a>
      <div className="mt-3">
        <a href={'/article/' + post.slug} className="text-base font-semibold text-sportswriter hover:text-sportswriter group-hover:underline">
          Read full story
        </a>
      </div>
    </div>
  )
}
