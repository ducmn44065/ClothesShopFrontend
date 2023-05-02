import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { useNavigate } from "react-router";
function ToggleLoginBtn() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const redirect = useNavigate();
  const [userName, setUserName] = useState("anonymous");
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user") || "{}");
    if (data.isAuthenticated) {
      setUserName(data.fullname);
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  });
  return (
    <>
      <div className="position-positive dropdown">
        <a
          className="nav-link dropdown-toggle me-4 w-75 h-75"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-circle w-100 h-100"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </a>

        <ul className={`dropdown-menu`} id={`${styles["dropdown-menu"]}`}>
          {isUserLoggedIn ? (
            <>
              <li>
                <div
                  onClick={(e) => {
                    localStorage.clear();
                    redirect("/");
                  }}
                  className="dropdown-item"
                >
                  Logout
                </div>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="d-flex justify-content-center">
                <small>
                  <b>{userName}</b>
                </small>
              </li>
            </>
          ) : (
            <li>
              <div
                onClick={(e) => {
                  redirect("/login");
                }}
                className="dropdown-item"
              >
                Login
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default ToggleLoginBtn;
