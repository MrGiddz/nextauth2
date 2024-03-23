-- CreateTable
CREATE TABLE "Auth2Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Auth2Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth2User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auth2Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Auth2Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth2User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auth2User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "phone" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Auth2VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth2Account_provider_providerAccountId_key" ON "Auth2Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth2Session_sessionToken_key" ON "Auth2Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Auth2User_email_key" ON "Auth2User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth2VerificationToken_token_key" ON "Auth2VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Auth2VerificationToken_identifier_token_key" ON "Auth2VerificationToken"("identifier", "token");
