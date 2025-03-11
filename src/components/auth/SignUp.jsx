import { useState } from "react";
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
	Alert,
} from "react-bootstrap"; // Import Bootstrap components
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function SignUp() {
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

	const handleSubmit = (e, formType) => {
		e.preventDefault();
		const formErrors = validateForm(formType);

		if (formType === "signup") {
			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}
			toast.success("Sign up successful!");
			navigate("/resume"); // Redirect on successful signup
		} else {
			// formType === "login"
			if (Object.keys(formErrors).length > 0) {
				setLoginErrors(formErrors);
				return;
			}
			// Simulate a successful login
			toast.success("Login successful!");
			navigate("/resume"); //Redirect to resume page.
		}
	};

	return (
		<StyledWrapper>
			<Container className="mt-5">
				<Row className="justify-content-center">
					<Col md={6}>
						<div className="d-flex justify-content-center mb-4">
							<Button
								variant={isLogin ? "primary" : "outline-primary"}
								onClick={() => setIsLogin(true)}
								className="me-2"
							>
								Login
							</Button>
							<Button
								variant={!isLogin ? "primary" : "outline-primary"}
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

								<Button variant="primary" type="submit" className="w-100">
									Login
								</Button>
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

								<Button variant="primary" type="submit" className="w-100">
									Sign Up
								</Button>
							</Form>
						)}
					</Col>
				</Row>
			</Container>
		</StyledWrapper>
	);
}

const StyledWrapper = styled.div`
	// You can keep your existing styles or adapt them to work with Bootstrap
	// For example, you might want to remove some styles that conflict with Bootstrap's defaults
	background-color: #f8f9fa; // Example of a subtle background color
	padding: 20px 0; // Add padding around the container
`;

export default SignUp;
