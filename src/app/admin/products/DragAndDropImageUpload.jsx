'use client'

import { useState, useRef } from 'react';
import { storage } from "@/firebaseInit";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

const DragAndDropImageUpload = ({ image, setImage }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const storageRef = ref(storage, `${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setImage(downloadURL);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div
            className={`flex gap-2 items-center *:p-4 my-2 border-2 border-dashed rounded text-center ${dragActive ? "border-blue-500" : "border-gray-300"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {image && (
                <div className='w-1/5'>
                    <Image src={image} width={128} height={128} alt="Preview" className="w-full object-cover mb-2" />
                </div>
            )}
            <div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />
                <p>Drag and drop an image here, or click to select</p>
                <button type="button" onClick={onButtonClick} className="mt-2 text-blue-500">
                    Select Image
                </button>
            </div>
        </div>
    );
};

export default DragAndDropImageUpload;