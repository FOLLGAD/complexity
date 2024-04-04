import { Suspense, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CitationCard } from './CitationCard';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { CitationPopup } from './CitationPopup';
import { TrackedLink } from './TrackedLink';
import { ActivityLogIcon, ReaderIcon } from '@radix-ui/react-icons';

export interface Citation {
  documentIds: string[];
  text: string;
  start: number;
  end: number;
}

export interface Document {
  url: string;
  title: string;
  id: string;
}

export type Step = {
  question: string;
  text: string;
  documents: Document[];
  citations: Citation[];
};

export const AnswerStep = ({ step }: { step: Step }) => {
  const text = useMemo(() => {
    let t = step.text;

    if (!step.citations) return t;

    for (let i = step.citations.length - 1; i >= 0; i--) {
      const citation = step.citations[i];
      const slice = t.slice(citation.start, citation.end);
      t =
        t.slice(0, citation.start) +
        `<cite class="text-orange-400" data-citation-id="${i}">${slice}</cite>` +
        t.slice(citation.end);
    }
    return t;
  }, [step.text, step.citations]);

  const components = useMemo(
    () => ({
      ul: ({ children }) => <ul className='list-disc'>{children}</ul>,
      ol: ({ children }) => <ol className='list-decimal'>{children}</ol>,
      cite: ({ node, children }) => {
        const id = node.properties.dataCitationId as string;
        return (
          <CitationPopup
            citation={step.citations[parseInt(id)]}
            documents={step.documents}
            key={id}
          >
            {children}
          </CitationPopup>
        );
      },
    }),
    [step.citations, step.documents, step.text]
  );

  if (!step.text) {
    return (
      <div className='pt-12 container max-w-4xl'>
        <h1 className='text-2xl font-medium mb-4'>{step.question}</h1>
        <Skeleton>
          <div className='h-16' />
        </Skeleton>
      </div>
    );
  }

  return (
    <div className='pt-10 max-w-sm md:max-w-md lg:max-w-xl'>
      <h1 className='text-2xl font-light mb-4 underline decoration-orange-400 decoration-2 underline-offset-4'>
        {step.question}
      </h1>
      <h2 className='text-md font-medium mb-4'>
        <ActivityLogIcon className='inline-block mr-2' width={18} height={18} />
        Sources
      </h2>
      {step.documents.length === 0 && (
        <p className='text-sm text-gray-500'>No sources used for this query.</p>
      )}
      <div className='relative rounded-lg overflow-hidden'>
        <div className='flex gap-4 overflow-x-auto mb-4'>
          {step.documents.map((doc) => (
            <TrackedLink
              href={doc.url}
              key={doc.url}
              target='_blank'
              rel='noreferrer'
              phData={{
                url: doc.url,
                title: doc.title,
              }}
            >
              <Suspense fallback={<div className='w-48 h-16' />}>
                <CitationCard key={doc.id} citation={doc} />
              </Suspense>
            </TrackedLink>
          ))}
        </div>
      </div>
      <h2 className='text-md font-medium mb-4'>
        <ReaderIcon className='inline-block mr-2' width={18} height={18} />
        Answer
      </h2>
      <p className='mb-8 prose md:prose-base scroll-smooth font-light selection:bg-orange-200/30 selection:text-orange-600'>
        <Markdown rehypePlugins={[rehypeRaw]} components={components}>
          {text}
        </Markdown>
      </p>
    </div>
  );
};
