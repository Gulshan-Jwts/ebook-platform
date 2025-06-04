import { createUploadthing } from "uploadthing/next";
import { NextResponse } from "next/server";
import { UploadThingError } from "uploadthing/server";
import { jwtVerify } from "jose";

const f = createUploadthing();

const auth = (request) => {
  const token = request.cookies.get("token")?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return { secret, token };
};

const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { secret, token } = auth(req);

      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const { payload } = await jwtVerify(token, secret);
      if (!payload?.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return { userId: payload?._id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image file url:", file.ufsUrl);
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),

  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { secret, token } = auth(req);

      if (!token) {
                throw new UploadThingError("unverified user")
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const { payload } = await jwtVerify(token, secret);
      if (!payload?.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return { userId: payload?._id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF file url:", file.ufsUrl);
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
};

export default ourFileRouter;
