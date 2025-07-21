-- CreateTable
CREATE TABLE "registrasi" (
    "no_register" VARCHAR(30) NOT NULL,
    "tgl_register" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_aset" VARCHAR(255) NOT NULL,
    "lokasi" VARCHAR(50),
    "department" VARCHAR(50),
    "harga_perolehan" DOUBLE PRECISION,
    "asset_user" VARCHAR(25)
);

-- CreateIndex
CREATE UNIQUE INDEX "registrasi_no_register_key" ON "registrasi"("no_register");

-- CreateIndex
CREATE UNIQUE INDEX "registrasi_nama_aset_key" ON "registrasi"("nama_aset");
