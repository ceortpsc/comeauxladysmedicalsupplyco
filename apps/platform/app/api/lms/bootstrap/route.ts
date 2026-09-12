import { NextResponse } from "next/server";
import { PROGRAMS, LEARNING_ENGINE } from "@comeaux/training";

export async function GET(){return NextResponse.json({programs:PROGRAMS,learningEngine:LEARNING_ENGINE,features:{gradedTracking:true,attendance:true,skillsGates:true,simulation:true,tulipHandoff:true,directTulipApi:false}})}
