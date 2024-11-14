import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link'

export default function Home() {
  // this component is the base page/landing page
  return (
    <div className={styles.page}>
      <Link href="/login">Login Page</Link>
      <Link href="/account">Accounts Page</Link>
      <Link href="/forms">Forms Page</Link>
      <p>this will eventually be the landing page</p>
    </div>
  );
}
