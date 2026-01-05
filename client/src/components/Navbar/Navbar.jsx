import styles from "./Navbar.module.css";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>TaskManagement</h1>

      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </nav>
  );
}
