"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
		imageUrl: "",
		eventName: "8 Ball Pool",
	});

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
			"Dive into the virtual realm of cues, balls, and pockets, and discover why millions of players choose 8 Ball Pool for endless fun and competitive challenges.",
		headName: "SAYAN PAUL",
		headPhoneNo: "7980059382",
		headEmailId: "spaul892007@gmail.com",
		coHeadName: "SARYANNA SAHA",
		coHeadPhoneNo: "8777250969",
		coHeadEmailId: "sarannyasaha.2002@gmail.com",
	};

	const rules = [
		"1.This competition si open to all.",
		"2.Every participant needs to download the game and the match.",
		"3.If you fail to attend a match in time you will not get any refund.",
		"4.No restriction in using cues.",
		"5.Players should contain at least 5000 coins in their account.",
	];

	return (
		<div className="relative h-screen w-screen md:flex gap-20 justify-center items-center md:mt-24 mb-[120vh] md:mb-0">
			<Contact
				params={contactDetails}
				rules={rules}
				imgUrl={"/EventPageImg/8ballpool.jpg"}
			/>
			<div className="flex items-center justify-center font-roboto">
				<div className="form-container p-8 rounded shadow-md w-[30rem]">
					<h1 className="text-3xl font-semibold text-center mb-4 text-white">
						8 Ball Pool
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
								className="form-input w-full p-2"
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
						<h1 className="text-red-600">
							* 8 BALL POLL: 50/- (Per head)
						</h1>
						<div className="mb-4 mt-4 ">
							<Image
								className="form-container"
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
