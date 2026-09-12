import SwiftUI

struct RootView: View {
    let purple = Color(red: 93/255, green: 42/255, blue: 138/255)
    let pink = Color(red: 233/255, green: 76/255, blue: 155/255)

    var body: some View {
        TabView {
            NavigationStack { HomeView() }.tabItem { Label("Home", systemImage: "cross.case.fill") }
            NavigationStack { Text("Store").font(.largeTitle.bold()) }.tabItem { Label("Store", systemImage: "bag.fill") }
            NavigationStack { Text("Academy").font(.largeTitle.bold()) }.tabItem { Label("Academy", systemImage: "graduationcap.fill") }
            NavigationStack { Text("Account").font(.largeTitle.bold()) }.tabItem { Label("Account", systemImage: "person.crop.circle.fill") }
        }
        .tint(purple)
    }
}

struct HomeView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                Text("Comeaux Lady's Medical Supply Co.").font(.largeTitle.bold())
                Text("A Family Company — Built for Nurses, Trusted by Clinics.").foregroundStyle(.secondary)
                Text("Medical supplies, healthcare training, verified savings and clinic onboarding in one mobile workspace.")
                RoundedRectangle(cornerRadius: 24).fill(Color(red: 244/255, green: 237/255, blue: 249/255)).frame(height: 180).overlay(Text("Store • LMS • Clinic Operations").font(.title3.bold()))
            }.padding()
        }
        .navigationTitle("Comeaux")
    }
}
