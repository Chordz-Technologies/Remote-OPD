export class Patient_model {
    srNo!: number;
    client_name!: string;
    patientName!: string;
    date!: string;
    village!: string;
    villageName!: string;
    camp_name!: string;
    category!: string;
    gender!: string;
    age!: number;
    day!: string;
    month!: string;
    year!: string;
    ageGroup!: string;
    week!: number;
    mobileNo!: number;
    signSymptoms!: string;
    physicalExamination!: string;
    investigation!: string;
    diagnosis!: string;
    prescribedMedicine1!: string;
    prescribedMedicine2!: string;
    dosage!: string;
    treatmentRemark!: string;
}

export class village_model {
    id!: number;
    name!: string;
    vnames!: string;

}
