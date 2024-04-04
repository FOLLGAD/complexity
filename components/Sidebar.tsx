'use client';
import { Logo } from '@/components/Logo';
import { useSessions } from '@/components/sessions';
import Link from 'next/link';
import { Button } from './ui/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { TrackedLink } from './TrackedLink';

const useClickOutside = () => {
  const node = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (e) => {
    if (node?.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return { node, isOpen, setIsOpen };
};

export const Sidebar = () => {
  const { sessions } = useSessions();

  const { node, isOpen, setIsOpen } = useClickOutside();
  const params = useSearchParams();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [params.get('id')]);

  return (
    <>
      <div className='absolute m-2 p-2 z-10 md:hidden'>
        <Button
          variant='outline'
          className='p-2 w-12 h-12 rounded-full'
          onClick={() => setIsOpen(!isOpen)}
        >
          <HamburgerMenuIcon className='w-6 h-6' />
        </Button>
      </div>
      <aside
        ref={node}
        className={cn(
          'flex flex-col h-screen  p-6 px-4 text-primary w-64 flex-shrink-0 flex-grow-0 md:static absolute transition-all z-10 bg-[#202222]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
      >
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Link href='/'>
              <p className='text-2xl font-light flex items-center hover:text-orange-400 selection:bg-orange-200 selection:text-orange-600 tracking-tight text-gradient'>
                <span className='w-8 h-8 mr-1'>
                  <Logo />
                </span>
                complexity
              </p>
            </Link>
          </div>
        </div>
        <div className='mt-8 w-full overflow-y-auto flex-grow pb-4 mb-4 selection:bg-orange-200/90 selection:text-orange-600'>
          <div className='text-xs text-gray-200/90 font-semibold mb-2 uppercase px-2'>
            Sessions
          </div>
          {sessions.length > 0 ? (
            <div className='flex flex-col gap-2 w-full overflow-ellipsis prose lg:prose-lg '>
              {sessions.map(([item]) => (
                <TrackedLink
                  key={item.id}
                  className={cn(
                    'w-full cursor-pointer text-sm font-normal no-underline text-gray-300 hover:text-primary hover:bg-primary/10 p-3 px-2 hover:border-primary/20 rounded-xl transition-colors',
                    params.get('id') === item.id &&
                      'bg-primary/10 border-primary/20 text-primary'
                  )}
                  href={`/?id=${item.id}`}
                  phData={{
                    questionId: item.id,
                    questionText: item.question,
                  }}
                >
                  <span
                    className="overflow-ellipsis line-clamp-2 pointer-events-none"
                    title={item.question}
                  >
                    {item.question}
                  </span>
                </TrackedLink>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-2">Ask a question.</p>
          )}
        </div>
        <div className="flex items-center">
          <a
            href="https://twitter.com/emilahlback"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-sm text-gray-200 font-medium p-2">
              @emilahlback
            </span>
          </a>
          {/* <a
            href="https://github.com/follgad/complexity"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" className="w-12 h-12 p-3">
              <GitHubLogoIcon className="w-full h-full" />
            </Button>
          </a> */}
        </div>
      </aside>
    </>
  );
};
