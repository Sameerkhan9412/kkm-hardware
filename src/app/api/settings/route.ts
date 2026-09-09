import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
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
    const payload = await request.json();

    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
    }

    settings.companyName = payload.companyName !== undefined ? payload.companyName : settings.companyName;
    settings.brandName = payload.brandName !== undefined ? payload.brandName : settings.brandName;
    settings.address = payload.address !== undefined ? payload.address : settings.address;
    settings.whatsapp = payload.whatsapp !== undefined ? payload.whatsapp : settings.whatsapp;
    settings.brochureLink = payload.brochureLink !== undefined ? payload.brochureLink : settings.brochureLink;
    settings.companyVideoUrl = payload.companyVideoUrl !== undefined ? payload.companyVideoUrl : settings.companyVideoUrl;
    
    if (Array.isArray(payload.emails)) {
      settings.emails = payload.emails.filter((e: string) => e.trim().length > 0);
    }
    if (Array.isArray(payload.phones)) {
      settings.phones = payload.phones.filter((p: string) => p.trim().length > 0);
    }
    
    settings.updatedAt = new Date();
    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
