import Link from 'next/link';

const Header = ({ currentUser }): JSX.Element => {

  const conditionalAuthLinks = [
    !currentUser && { label: 'Sign Up', href: '/auth/sign-up' },
    !currentUser && { label: 'Sign In', href: '/auth/sign-in' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/sign-out' }
  ]
    .filter((link => link))
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {conditionalAuthLinks}
        </ul>
      </div>
    </nav>
  );
};

export { Header };
