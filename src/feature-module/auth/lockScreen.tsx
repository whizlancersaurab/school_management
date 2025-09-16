import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
type PasswordField = "password" | "confirmPassword";


const LockScreen = () => {

  const routes = all_routes;

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <form >
          <div className="d-flex flex-column justify-content-between vh-100">
            <div className=" mx-auto p-4 text-center">
              <ImageWithBasePath
                src="assets/img/authentication/authentication-logo.svg"
                className="img-fluid"
                alt="Logo"
              />
            </div>
            <div className="card">
              <div className="card-body p-4">
                <div className=" mb-4 text-center">
                  <h2 className="mb-2">Welcome back! </h2>
                  <ImageWithBasePath
                    src="assets/img/profiles/avatar-27.jpg"
                    alt="img"
                    className="img-fluid avatar avatar-xxl rounded-pill my-3"
                  />
                  <h6 className="text-dark">Adrian Davies</h6>
                </div>
                <div className="mb-3 ">
                  <div className="pass-group">
                    <input
                      type={
                        passwordVisibility.password
                          ? "text"
                          : "password"
                      }
                      className="pass-input form-control"
                    />
                    <span
                      className={`ti toggle-passwords ${passwordVisibility.password
                          ? "ti-eye"
                          : "ti-eye-off"
                        }`}
                      onClick={() =>
                        togglePasswordVisibility("password")
                      }
                    ></span>
                  </div>
                </div>
                <Link to={routes.adminDashboard} className="btn btn-primary w-100">
                  Login
                </Link>
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="d-flex justify-content-center">
                <Link to="#" className="me-3 text-default">
                  Terms &amp; Condition
                </Link>
                <Link to="#" className="me-3 text-default">
                  Privacy
                </Link>
                <Link to="#" className="me-3 text-default">
                  Help
                </Link>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle text-default"
                    data-bs-toggle="dropdown"
                  >
                    English
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <Link to="#" className="text-default">
                        Japanese
                      </Link>
                    </li>
                    <li className="dropdown-item">
                      <Link to="#" className="text-default">
                        Chinese
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-2 text-center">
                <p className="mb-0 ">Copyright © 2024 - Preskool</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default LockScreen;
