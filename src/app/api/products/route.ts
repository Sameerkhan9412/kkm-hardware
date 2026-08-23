import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    
    let filter: any = {};
    
    if (categorySlug) {
      const categoryObj = await Category.findOne({ slug: categorySlug });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        // Category slug invalid or not found, return empty array
        return NextResponse.json({ success: true, data: [] });
      }
    }

    let query = Product.find(filter).populate("category").sort({ createdAt: -1 });

    if (limitParam) {
      const limit = parseInt(limitParam);
      if (!isNaN(limit)) {
        query = query.limit(limit);
      }
    }

    const products = await query.exec();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { name, image, category } = await request.json();

    if (!name || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name or category" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(image || "", "products");
    const newProduct = await Product.create({ name, image: imageUrl, category });
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated(request))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id, name, image, category } = await request.json();

    if (!id || !name || !category) {
      return NextResponse.json(
        { success: false, message: "Product ID, name, and category are required" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(image || "", "products");
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, image: imageUrl, category },
      { new: true }
    ).populate("category");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
