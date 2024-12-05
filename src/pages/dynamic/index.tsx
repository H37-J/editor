import Link from "next/link";

const IndexPage = () => (
  <>
    <h1>Hello World Page</h1>
    <ol>
      <li>
        <Link href="/dynamic/[dynamic]" as="/dynamic/page-1">
          Link to dynamic page 1
        </Link>
      </li>
      <li>
        <Link href="/dynamic/[dynamic]" as="/dynamic/page-2">
          Link to dynamic page 2
        </Link>
      </li>
      <li>
        <Link href="/dynamic/[dynamic]" as="/dynamic/page-3">
          Link to dynamic page 3
        </Link>
      </li>
      <li>
        <Link href="/dynamic/[dynamic]" as="/dynamic/page-4">
          Link to dynamic page 4
        </Link>
      </li>
      <li>
        <Link href="/dynamic/[dynamic]" as="/dynamic/page-5">
          Link to dynamic page 5
        </Link>
      </li>
    </ol>
  </>
);

export default IndexPage;
