// Signup.jsx
// ... (Your existing imports and component code) ...
import { useState, useEffect } from "react"; // Import useEffect
import toast from "react-hot-toast";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	InputGroup,
	Alert, // Import Bootstrap components
} from "react-bootstrap";
import { GoogleSignInButton } from "./GoogleSignInButton";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Credentials() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loginData, setLoginData] = useState({
		//Separate login data
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState({});
	const [loginErrors, setLoginErrors] = useState({}); // Separate Login errors
	const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

	const handleChange = (e, formType) => {
		const { name, value } = e.target;

		if (formType === "signup") {
			setFormData({
				...formData,
				[name]: value,
			});
			// Clear the specific error when the user starts typing again
			if (errors[name]) {
				setErrors({ ...errors, [name]: null });
			}
		} else {
			// formType === "login"
			setLoginData({
				...loginData,
				[name]: value,
			});
			if (loginErrors[name]) {
				setLoginErrors({ ...loginErrors, [name]: null });
			}
		}
	};

	const validateForm = (formType) => {
		let newErrors = {};

		if (formType === "signup") {
			if (!formData.name.trim()) {
				newErrors.name = "Name is required";
			}

			if (!formData.email.trim()) {
				newErrors.email = "Email is required";
			} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
				newErrors.email = "Email is invalid";
			}

			if (!formData.password) {
				newErrors.password = "Password is required";
			} else if (formData.password.length < 6) {
				newErrors.password = "Password must be at least 6 characters";
			}

			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
			}
		} else {
			// Login validation
			if (!loginData.email.trim()) {
				newErrors.email = "Email is required";
			} else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
				newErrors.email = "Email is invalid";
			}
			if (!loginData.password) {
				newErrors.password = "Password is required";
			}
		}

		return newErrors;
	};

	const handleSignup = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5500/api/signup",
				formData, // Send the signup form data
				{ withCredentials: true }
			);
			console.log("Signup successful:", response.data);
			toast.success(response.data.message); // Show success message
			navigate("/resume"); // Redirect to the resume page
		} catch (error) {
			console.error("Signup error:", error);
			if (error.response) {
				toast.error(error.response.data.error || "Signup failed"); // Show specific error
			} else {
				toast.error("Signup failed. Please try again later."); // Generic error
			}
		}
	};

	const handleLogin = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5500/api/login",
				loginData, // Send the login form data
				{ withCredentials: true }
			);
			console.log("Login successful:", response.data);
			toast.success(response.data.message); // Show success message.
			navigate("/resume");
		} catch (error) {
			console.error("Login error:", error);
			if (error.response) {
				toast.error(error.response.data.error || "Login failed"); // Show specific error message
			} else {
				toast.error("Login failed"); // Generic error
			}
		}
	};

	const handleSubmit = (e, formType) => {
		e.preventDefault();
		const formErrors = validateForm(formType);

		if (formType === "signup") {
			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}
			handleSignup(); // Call the signup function
		} else {
			// formType === "login"
			if (Object.keys(formErrors).length > 0) {
				setLoginErrors(formErrors);
				return;
			}
			handleLogin(); // Call the login function
		}
	};

	const handleGoogleSignInSuccess = async (tokenResponse) => {
		try {
			// 1. Get user info from Google
			const userInfoResponse = await axios.get(
				"https://www.googleapis.com/oauth2/v3/userinfo",
				{
					headers: {
						Authorization: `Bearer ${tokenResponse.access_token}`,
					},
				}
			);

			const userData = userInfoResponse.data;

			// 2. Send user data to your backend
			const backendResponse = await axios.post(
				"http://localhost:5500/api/auth", // Your backend endpoint
				{
					name: userData.name,
					email: userData.email,
					provider: "google",
					providerid: userData.sub, // Google's user ID
				},
				{
					withCredentials: true, // Important: Send cookies
				}
			);
			console.log("Backend response:", backendResponse.data);
			toast.success("Successfully signed in with Google!");
			navigate("/resume");
		} catch (error) {
			console.error("Error during Google sign-in:", error);
			toast.error("Failed to sign in with Google");
			if (error.response) {
				console.error("Server responded with:", error.response.data);
			}
		}
	};
	//Check for the cookie when the compenent mounts and navigates user to resume page

	useEffect(() => {
		const checkCookie = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5500/api/protected",
					{
						withCredentials: true,
					}
				);
				// Assuming a successful response means the cookie is valid
				if (response.status === 200) {
					navigate("/resume"); // Redirect to resume if cookie is valid
				}
			} catch (error) {
				// If there's an error (e.g., 401 Unauthorized), the cookie is likely invalid, do nothing
				console.log("User not authenticated", error);
			}
		};

		checkCookie();
	}, [navigate]);

	return (
		<StyledWrapper>
			<Container className="mt-5">
				<Row className="justify-content-center">
					<Col md={6}>
						<div className="d-flex justify-content-center mb-4">
							<Button
								variant={isLogin ? "success" : "outline-success"} // Changed to success
								onClick={() => setIsLogin(true)}
								className="me-2"
							>
								Login
							</Button>
							<Button
								variant={!isLogin ? "success" : "outline-success"} // Changed to success
								onClick={() => setIsLogin(false)}
							>
								Sign Up
							</Button>
						</div>

						{isLogin ? (
							<Form onSubmit={(e) => handleSubmit(e, "login")}>
								<h2 className="text-center mb-4">Login</h2>
								<Form.Group className="mb-3" controlId="loginEmail">
									<Form.Label>Email address</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter email"
										name="email"
										value={loginData.email}
										onChange={(e) => handleChange(e, "login")}
										isInvalid={!!loginErrors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{loginErrors.email}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3" controlId="loginPassword">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Password"
										name="password"
										value={loginData.password}
										onChange={(e) => handleChange(e, "login")}
										isInvalid={!!loginErrors.password}
									/>
									<Form.Control.Feedback type="invalid">
										{loginErrors.password}
									</Form.Control.Feedback>
								</Form.Group>

								<Button
									variant="success"
									type="submit"
									className="w-100 mb-3"
									value="login"
								>
									Login
								</Button>
								<div className="text-center mb-3">
									<span>Or</span>
								</div>
								<GoogleSignInButton
									onSuccess={handleGoogleSignInSuccess}
									onError={(error) => {
										console.error("Google sign-in error:", error);
										toast.error("Failed to sign in with Google");
									}}
								/>
							</Form>
						) : (
							<Form onSubmit={(e) => handleSubmit(e, "signup")}>
								<h2 className="text-center mb-4">Sign Up</h2>
								<Form.Group className="mb-3" controlId="formName">
									<Form.Label>Name</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your name"
										name="name"
										value={formData.name}
										onChange={(e) => handleChange(e, "signup")}
										isInvalid={!!errors.name}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.name}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3" controlId="formEmail">
									<Form.Label>Email address</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter email"
										name="email"
										value={formData.email}
										onChange={(e) => handleChange(e, "signup")}
										isInvalid={!!errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3" controlId="formPassword">
									<Form.Label>Password</Form.Label>
									<InputGroup>
										<Form.Control
											type="password"
											placeholder="Password"
											name="password"
											value={formData.password}
											onChange={(e) => handleChange(e, "signup")}
											isInvalid={!!errors.password}
										/>

										<Form.Control.Feedback type="invalid">
											{errors.password}
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>

								<Form.Group className="mb-3" controlId="formConfirmPassword">
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Confirm Password"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={(e) => handleChange(e, "signup")}
										isInvalid={!!errors.confirmPassword}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.confirmPassword}
									</Form.Control.Feedback>
								</Form.Group>

								<Button
									variant="success"
									type="submit"
									className="w-100 mb-3"
									value="signup"
								>
									Sign Up
								</Button>
								<div className="text-center mb-3">
									<span>Or</span>
								</div>
								<GoogleSignInButton
									onSuccess={handleGoogleSignInSuccess}
									onError={(error) => {
										console.error("Google sign-in error:", error);
										toast.error("Failed to sign in with Google");
									}}
								/>
							</Form>
						)}
					</Col>
				</Row>
			</Container>
		</StyledWrapper>
	);
}

const StyledWrapper = styled.div`
	background-color: #f8f9fa;
	padding: 20px 0;

	/* Bootstrap Overrides - Change Blue to Green */
	.btn-primary {
		background-color: #356851; /* Bootstrap's success color */
		border-color: #356851;

		&:hover {
			background-color: #218838; /* Darker green on hover */
			border-color: #1e7e34;
		}
	}
	/* For outline buttons */
	.btn-outline-primary {
		color: #356851;
		border-color: #356851;
		&:hover {
			background-color: #356851;
			border-color: #356851;
			color: white;
		}
	}
	/* For form feedback (validation) */
	.is-invalid {
		border-color: #dc3545; /* Keep Bootstrap's danger color for errors */
	}
	.invalid-feedback {
		color: #dc3545;
	}
	/* For form controls when focused */
	.form-control:focus {
		border-color: #356851; /* Green border on focus */
		box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* Green glow */
	}
`;

export default Credentials;
