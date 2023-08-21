import React, { useState } from "react";
import Index from "../components/Index";
import New from "../components/New";

export default function Home() {
	const [activePage, setActivePage] = useState("index");

	const navigateToPage = (page) => {
		setActivePage(page);
	};

	return (
		<>
			{/* {activePage === 'index' && <Index navigateToPage={navigateToPage} />} */}
			<div className="min-h-[50px] w-full flex justify-center items-center bg-red-600">
				<span className="text-white">F*** you</span>
			</div>

			{/* {activePage === 'new' && <New navigateToPage={navigateToPage} />} */}
		</>
	);
}
