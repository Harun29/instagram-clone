

const SignedInLinks = () => {

  

  return (
    <ul>

      <NavLink to='/createpost'>
        <Button className="me-2">Post</Button>
      </NavLink>

          {/* <NavLink to="update-profile" className="dropdown-item">Settings</NavLink> */}
          {/* <button onClick={handleLogout} className="dropdown-item">Logout</button> */}

    </ul>
  );
}

export default SignedInLinks;