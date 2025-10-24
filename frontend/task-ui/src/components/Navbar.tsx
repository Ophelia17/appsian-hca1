import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="#">
          Basic Task Manager
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
