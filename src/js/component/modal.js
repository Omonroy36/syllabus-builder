import React, { useState, useEffect, useContext } from "react";
import { ContentContext } from "../context.js";
import PropTypes from "prop-types";

export const UploadSyllabus = ({ onConfirm }) => {
	const [value, setValue] = useState("");
	return (
		<div className="alert alert-light">
			<input
				type="text"
				readOnly={typeof value.content != "undefined"}
				className="form-control"
				placeholder={"Type the syllabus URL here. E.g: https://domain.com/syllabus.json"}
				value={value.content || value}
				onChange={e => setValue(e.target.value)}
			/>
			<input
				type="file"
				className="form-control"
				placeholder={"Or browser for a file"}
				onChange={e => {
					const reader = new FileReader();
					const files = e.target.files;
					reader.onload = () => {
						setValue({ name: files[0].name, content: reader.result });
					};
					reader.readAsText(files[0]);
				}}
			/>
			<button className="btn btn-success mr-2" onClick={() => value != "" && onConfirm({ value: true, url: value })}>
				Save
			</button>
			<button className="btn btn-light" onClick={() => onConfirm({ value: false, url: value })}>
				Cancel
			</button>
		</div>
	);
};
UploadSyllabus.propTypes = {
	question: PropTypes.string,
	onConfirm: PropTypes.func
};

export const SyllabusDetails = ({ onConfirm }) => {
	const { store, actions } = useContext(ContentContext);
	const [label, setLabel] = useState(store.info.label);
	const [profile, setProfile] = useState(store.info.profile);
	const [desc, setDesc] = useState(store.info.description);
	const [version, setVersion] = useState(store.info.version);
	const [state, setState] = useState(false);
	const handleClick = course => {
		setState(true);
		setProfile(course), actions.setCourseSlug(course);
	};
	return (
		<div>
			<div className="row">
				<div className="col">
					<input
						type="text"
						className="form-control"
						placeholder={store.info.label !== undefined ? store.info.label : "Course label, e.g: FullStack 12 weeks"}
						value={label}
						onChange={e => setLabel(e.target.value)}
					/>
				</div>
				<div className="col-6">
					<div className="input-group mb-3">
						<select className="form-control" onChange={e => handleClick(e.target.value)} value={profile}>
							<option key={0} value={null} selected disabled>
								Select profile
							</option>
							{store.profiles.map((course, i) => {
								return (
									<option key={i} value={course.slug}>
										{course.slug}
									</option>
								);
							})}
						</select>
						<select
							className={"form-control  " + (state !== false ? "" : "d-none")}
							onChange={e => {
								actions.getApiSyllabus(e.target.value);
								setVersion(e.target.value);
							}}
							value={store.info.value}>
							<option key={0} value={null} selected disabled>
								Select version
							</option>
							{store.syllabus !== null && store.syllabus.length > 0 ? (
								store.syllabus.map((syllabu, i) => {
									return (
										<option key={i} value={syllabu.version}>
											{syllabu.version}
										</option>
									);
								})
							) : (
								<option disabled>no version</option>
							)}
						</select>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<textarea
						className="form-control"
						placeholder={store.info.description !== undefined ? store.info.description : "What is this syllabus about?"}
						value={desc}
						onChange={e => setDesc(e.target.value)}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-12 text-center">
					<button
						className="btn btn-success mr-2"
						onClick={() =>
							onConfirm({
								value: true,
								data: { profile, description: desc, label, slug: profile + ".v" + version, version }
							})
						}>
						Save
					</button>
					<button className="btn btn-light" onClick={() => onConfirm(false)}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
SyllabusDetails.propTypes = {
	profiles: PropTypes.array,
	onConfirm: PropTypes.func
};
SyllabusDetails.defaultProps = {
	profiles: []
};
