"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import Contact from "../../eventDetails/Contact";
import "../styles.css";

const Page = () => {
	const router = useRouter();
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		teamName:"",
		imageUrl: "",
		eventName: "Treasure Hunt",
		participants: [],
	});

	const addParticipant = () => {
		setFormData({
			...formData,
			participants: [...formData.participants, { name: "", email: "" }],
		});
	};

	const removeParticipant = (index) => {
		const updatedParticipants = [...formData.participants];
		updatedParticipants.splice(index, 1);

		setFormData({
			...formData,
			participants: updatedParticipants,
		});
	};

	const handleForm = async (event) => {
		event.preventDefault();
		try {
			setIsLoading(true);
			// For Image Upload..
			const inputFileData = new FormData();
			inputFileData.append("file", file);
			inputFileData.append("upload_preset", "techimage");
			const data = await axios.post(
				"https://api.cloudinary.com/v1_1/techverse/image/upload",
				inputFileData
			);
			const imageUrl = await data.data.secure_url;
			// Send The Data in Backend..
			const res = await axios.post("/api/registration", {
				...formData,
				imageUrl: imageUrl,
			});
			// Check The Backend Response...
			if (res.data.message === "Registration Done.") {
				setIsLoading(false);
				toast.success("Registration Done", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				const id = res.data.data._id;
				router.push(`/eventregistration/eventticket/${id}`);
			} else {
				throw new Error("Backend registration failed");
			}
		} catch (error) {
			setIsLoading(false);
			toast.error("Error to Register.", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			console.error("Error", error);
		}
	};

	const contactDetails = {
		details:
			"Welcome, adventurers! Embark on a thrilling journey, solve clues, and unveil secrets in our exciting treasure hunt. Let's begin the quest!",
		headName: "ISHANJIT MUKHOPADHYAY",
		headPhoneNo: "6001222799",
		headEmailId: "ishanjit2003@gmail.com",
		coHeadName: "MD SOHEL SHEK",
		coHeadPhoneNo: "7986632385",
		coHeadEmailId: "sohelshekmd16@gmail.com",
	};

	const rules = [
		"1.Each team should consist of 1to 4 members, with a recommended minimum of 3 for faster completion of the challenge.The challenge comprises 5 rounds, during which teams receive clues to decode, leading them to the location for the next clue.",
		"2.Teams have a total of 25 minutes, with 5 minutes allocated to each round. Time management within rounds is at the discretion of the teams, but the entire hunt must be completed within the specified time frame.Admins will monitor teams closely. Cheating leads to disqualification.",
		"3.The use of mobile phones a n d other electronic devices is strictly prohibited.Winning depends on completing the quest in the allotted time. The fastest team will be declared the overall winner.",
		"4.Basic knowledge related to technology si required, although not all clues will be tech-related.",
		"5.Drawing inspiration from the movie 'Student of the Year,' particularly the last scene, the challenge si designed to evoke a similar competitive spirit and excitement.",
	];

	return (
		<div className="h-screen w-screen md:h-auto md:flex gap-20 justify-center items-center md:mt-24">
			<Contact
				params={contactDetails}
				rules={rules}
				imgUrl={"/EventPageImg/treasure hunt.jpg"}
			/>
			<div className="flex items-center justify-center font-roboto">
				<div className="form-container p-8 rounded shadow-md w-[30rem]">
					<h1 className="text-3xl font-semibold text-center mb-4 text-white">
						Treasure Hunt
					</h1>
					<form onSubmit={handleForm}>
						<div className="mb-4">
							<label className="form-label block">
								Email:
							</label>
							<input
								onChange={(event) => {
									setFormData({
										...formData,
										email: event.target.value,
									});
								}}
								value={formData.email}
								type="email"
								required={true}
								className="form-input w-full rounded p-2"
							/>
						</div>
						<div className="mb-4">
							<label className="form-label block">
								Team Name:
							</label>
							<input
								onChange={(event) => {
									setFormData({
										...formData,
										teamName: event.target.value,
									});
								}}
								value={formData.teamName}
								type="text"
								required={true}
								className="form-input w-full rounded p-2"
							/>
						</div>
						<div className="flex gap-2">
							<div className="mb-4">
								<label className="form-label block">
									Name:
								</label>
								<input
									onChange={(event) => {
										setFormData({
											...formData,
											name: event.target.value,
										});
									}}
									value={formData.name}
									type="text"
									required={true}
									className="form-input w-full rounded p-2"
								/>
							</div>
							<div className="mb-4">
								<label className="form-label block">
									Phone Number:
								</label>
								<input
									onChange={(event) => {
										setFormData({
											...formData,
											phone: event.target.value,
										});
									}}
									value={formData.phone}
									type="phone"
									required={true}
									className="form-input w-full rounded p-2"
								/>
							</div>
						</div>
						{formData.participants.map((participant, index) => (
							<div key={index}>
								<div className="flex gap-1">
									<input
										type="text"
										placeholder={`Participant ${
											index + 1
										} Name`}
										value={participant.name}
										onChange={(e) =>
											setFormData({
												...formData,
												participants:
													formData.participants.map(
														(p, i) =>
															i === index
																? {
																		...p,
																		name: e
																			.target
																			.value,
																  }
																: p
													),
											})
										}
										className="form-input w-full rounded p-2"
									/>
									<input
										type="email"
										placeholder={`Participant ${
											index + 1
										} Email`}
										value={participant.email}
										onChange={(e) =>
											setFormData({
												...formData,
												participants:
													formData.participants.map(
														(p, i) =>
															i === index
																? {
																		...p,
																		email: e
																			.target
																			.value,
																  }
																: p
													),
											})
										}
										className="form-input w-full rounded p-2"
									/>
								</div>
								<button
									type="button"
									onClick={() => removeParticipant(index)}
									className="button-red mt-2 mb-5 w-60 rounded py-2"
								>
									Remove
								</button>
							</div>
						))}
						{formData.participants.length < 4 && (
							<button
								type="button"
								onClick={addParticipant}
								className="button-green mb-10 w-60 rounded py-2"
							>
								Add Participant
							</button>
						)}
						<h1 className="text-red-600">
							* TREASURE HUNT: <hr /> (170/- for 3 participants)
							(200/- for 4 participants)
						</h1>
						<div className="mb-4 mt-4">
							<Image
								src="/qr_code.jpeg"
								width={200}
								height={200}
								alt="qrcode"
							/>
							<h1 className="text-white">
								UPI ID:{" "}
								<span className="text-orange-400">
									8170842884@paytm
								</span>
							</h1>
						</div>
						<div className="mb-4">
							<label className="form-label block">
								Payment Photo
							</label>
							<input
								onChange={(event) => {
									setFile(event.target.files[0]);
								}}
								accept="image/*"
								type="file"
								name="file"
								required={true}
								className="form-input w-full rounded p-2"
							/>
						</div>
						<button
							type="submit"
							className="button w-full font-bold rounded py-2"
						>
							{isLoading ? "Submitting..." : "Submit"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Page;
