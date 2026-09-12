# iOS workspace

Native SwiftUI scaffold for iOS 17+.

```bash
brew install xcodegen
cd mobile/ios
xcodegen generate
xcodebuild -project ComeauxLadiesMedicalSupply.xcodeproj -scheme ComeauxLadiesMedicalSupply -sdk iphonesimulator -configuration Debug CODE_SIGNING_ALLOWED=NO build
```

Production account, commerce and LMS screens must use authenticated API endpoints and should not persist payment or regulatory secrets in the client.
