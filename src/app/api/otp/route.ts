import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const otp = await req.json()
        const otpArr = otp?.OTP?.split('');
        if (otpArr.length < 6) {
            return NextResponse.json({ message: 'Validation Error' }, { status: 400 })
        }
        for (let otpp of otpArr) {
            if (isNaN(otpp) == true) {
                return NextResponse.json({ message: "Validation Error" }, { status: 400 })
            }


        }

        return NextResponse.json({ message: 'Verified' }, { headers: { 'content-type': 'application/json' }, status: 201 })

    } catch (error: any) {
        return NextResponse.json({ message: error?.message }, { status: 500 })

    }
}
