import Link from 'next/link';

export function HesitationLink() {
  return (
    <div className="text-center mt-12 mb-8">
      <p className="text-[#333333] text-sm">
        Feeling hesitant?{' '}
        <Link href="/5r/relevance" className="text-[#20B2AA] hover:underline">
          Click here to see the 5 R's motivation plan
        </Link>
      </p>
    </div>
  );
}
