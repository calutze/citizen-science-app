import Link from 'next/link';

export default function Home() {
  // this component is the base page/landing page
  return (
    <div>
    <h1 className="websiteHeader">Citizen Science App</h1>
    <div className="landingContainer">
      <h2>Welcome to the teacher site for Citizen Science App!</h2>
      <div className="infoSection">
        <h4>From this website you can:</h4>
        <ul>
          <li>Create a new project</li>
          <li>Create observation forms</li>
          <li>View different projects you&apos;ve created</li>
          <li>See the data visualized in one place</li>
        </ul>
      </div>
      <div>
        <p>
          Already a member?{' '}
          <Link href="/login" >
            Login Here
          </Link>
        </p>
        <p>
          Looking to get started?{' '}
          <Link href="/login/register" >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
}
