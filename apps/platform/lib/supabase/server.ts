import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url || !publishableKey) throw new Error("Supabase server client is not configured.");
  const cookieStore=await cookies();
  return createServerClient(url,publishableKey,{
    db:{schema:"comeaux"},
    cookies:{
      getAll(){return cookieStore.getAll()},
      setAll(items){
        try{items.forEach(({name,value,options})=>cookieStore.set(name,value,options))}
        catch{/* Server Components may not write cookies; proxy handles refresh. */}
      }
    }
  });
}
