"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { toast, Toaster } from "sonner";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";

const Page = () => {
  const [inputValues, setInputValues] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { token } = useUser();
  const { push } = useRouter();
  const [postValues, setPostValues] = useState("");
  const HF_API_KEY = process.env.HF_API_KEY;

  const handleInputValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValues(value);
  };

  const generateImage = async () => {
    if (!inputValues.trim()) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: inputValues,
            parameters: {
              negative_prompt:
                "blurry, bad quality, distorted, body proportions are not correct, too accurate",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setImageUrl(uploaded.url);
      if (uploaded) {
        toast.success("yippee");
      }
    } catch (err) {
      console.log("fail :o");
    }
  };

  const createPost = async () => {
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: "caption",
        images:
          "https://fastly.picsum.photos/id/67/200/300.jpg?hmac=GntzjckKE7-naeHFrr8ZEIIaj3Bm-Iln4f844p1Np08",
      }),
    });

    if (response.ok) {
      toast.success("ert");
    }
  };

  const handleCaption = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  };

  return (
    <div>
      <div className="sticky top-0 right-0 left-0 z-50 w-full height-[5vh] opacity-90 backdrop-blur-3xl bg-white border-b-1 border-b-gray-500 flex justify-center flex-col pb-[20px]">
        <button
          className="font-bold h-[70px] text-[20px] opacity-100 flex flex-row pr-[50px]"
          onClick={() => push("/")}
        >
          {" "}
          X{" "}
        </button>{" "}
        <div className="flex justify-center">New Photo Post</div>
      </div>
      <div className="text-[40px]">Explore ai generated images</div>
      <Input
        onChange={handleInputValues}
        placeholder="input"
        className="flex justify-center h-[50px] "
      ></Input>
      <Button onClick={generateImage} className="flex justify-end">
        generate
      </Button>

      <img src={imageUrl || undefined} />

      <Input
        placeholder="your caption"
        name="caption"
        onChange={handleCaption}
      ></Input>
      <Toaster />
    </div>
  );
};

export default Page;
