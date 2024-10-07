import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.scss']
})
export class CampsComponent implements OnInit {
  currentForm: string = 'ncd-eye-screening';
  clients: any[] = [];
  villages: any[] = [];
  subVillages: string[] = [];
  eyeScreeningForm!: FormGroup;
  hbScreeningForm!: FormGroup;
  aarogyaCampForm!: FormGroup;
  megaCampForm!: FormGroup;
  // uniqueCode: string[] = ['No Fit', 'Correction', 'Operation Done', 'Healthy', 'Impairment', 'Dryness', 'White Part']; // Example villages

  constructor(private fb: FormBuilder,
    private patientService: ServiceService,
    private eyeScreeningService: ServiceService,
    private hbScreeningService: ServiceService,
    private router: Router,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    //Eye Screening Camp
    this.eyeScreeningForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Regex for 10-digit mobile number
      village: ['', Validators.required],
      subvillage: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      opinion: [''],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
    });

    //HB Screening Camp Form
    this.hbScreeningForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      village: ['', Validators.required],
      subvillage: ['', Validators.required],
      HB: ['', [Validators.required, Validators.min(1)]], // HB field
      HBReadings: ['', Validators.required], // HB status field
    });

    //Aarogya Dhansampada Camp
    this.aarogyaCampForm = this.fb.group({
      client_name: ['', Validators.required],
      patientName: ['', Validators.required],
      date: ['', Validators.required],
      day: [{ value: '', disabled: true }],
      month: [{ value: '', disabled: true }],
      year: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contactNo: ['', Validators.required],
      mainVillage: ['', Validators.required],
      subVillage: ['', Validators.required],
      schoolName: ['', Validators.required],
      standard: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      bmi: [{ value: '', disabled: true }], // Auto-calculated BMI
      bmiStatus: [{ value: '', disabled: true }], // Auto-populated BMI status
      hb: ['', [Validators.required, Validators.min(1)]], // HB field
      HBReadings: ['', Validators.required], // HB status field
    });

    // Watch for weight and height changes to calculate BMI
    this.aarogyaCampForm.get('weight')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    this.aarogyaCampForm.get('height')?.valueChanges.subscribe(() => {
      this.calculateBMI();
    });

    //Mega Camp
    this.megaCampForm = this.fb.group({
      client_name: ['', Validators.required],
      patientName: ['', Validators.required],
      date: ['', Validators.required],
      day: [{ value: '', disabled: true }],
      month: [{ value: '', disabled: true }],
      year: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Adjust pattern for phone numbers if needed
      mainVillage: ['', Validators.required],
      subVillage: ['', Validators.required],
      breastCancer: ['', Validators.required],
      oralCancer: ['', Validators.required],
      cervicalCancer: ['', Validators.required],
      tbTest: ['', Validators.required],
      description: ['', Validators.required],
    });


    this.getVillages();
  }

  getVillages(): void {
    this.patientService.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    // Fetch client names
    this.patientService.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;
      }
    });
  }

  onMainVillageChange(event: any): void {
    const selectedVillageId = event.target.value;
    const selectedVillage = this.villages.find(village => village.id === +selectedVillageId);

    if (selectedVillage) {
      this.subVillages = selectedVillage.vnames;
      this.megaCampForm.patchValue({ subVillage: '' }); // Reset sub-village when main village changes
    } else {
      this.subVillages = []; // Clear sub-villages if no main village is selected
    }
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);

    if (!isNaN(selectedDate.getTime())) {
      const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }); // Get day name (e.g., Monday)
      const month = selectedDate.toLocaleString('en-US', { month: 'long' }); // Get month name (e.g., January)
      const year = selectedDate.getFullYear();
      const week = this.getWeekNumber(selectedDate); // Calculate week number

      // Update the day and month form controls
      this.eyeScreeningForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
        week: week // Week number
      });
      this.hbScreeningForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
        week: week // Week number
      });
      this.aarogyaCampForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
        week: week // Week number
      });
      this.megaCampForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
        week: week // Week number
      });
    }
  }

  // Function to calculate the ISO week number
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }


  //Eye Screening Camp
  onUniqueCodeChange(event: any): void {
    const selectedUniqueCode = event.target.value.toLowerCase();

    switch (selectedUniqueCode) {
      case 'no fit':
        this.eyeScreeningForm.patchValue({
          description: 'Cataract detected but patient is not fit for operation'
        });
        break;
      case 'correction':
        this.eyeScreeningForm.patchValue({
          description: 'Detection of Refractive Index & correction required'
        });
        break;
      case 'healthy':
        this.eyeScreeningForm.patchValue({
          description: 'No eye illness found - Healthy Eyes'
        });
        break;
      case 'impairment':
        this.eyeScreeningForm.patchValue({
          description: 'Presbyopia and Vision Impairment'
        });
        break;
      case 'dryness':
        this.eyeScreeningForm.patchValue({
          description: 'Detection of eye diseases esp. Eye dryness'
        });
        break;
      case 'white part':
        this.eyeScreeningForm.patchValue({
          description: 'Pterygium (This growth covers the white part of the eye and extends onto the cornea)'
        });
        break;
      default:
        this.eyeScreeningForm.patchValue({ description: '' });
        break;
    }
  }

  // Submit the Eye Screening Camp form
  onSubmitEyeScreeningCamp(): void {
    if (this.eyeScreeningForm.valid) {
      const formData = this.eyeScreeningForm.value;

      // Replace the village ID with its corresponding name
      const selectedVillage = this.villages.find(village => village.id === +formData.village);
      if (selectedVillage) {
        formData.village = selectedVillage.name; // Set the village name instead of ID
      }

      // Now submit the formData object with village name
      this.eyeScreeningService.postEyeCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Eye Screening Camp details submitted successfully!', 'Success');
            this.eyeScreeningForm.reset();
            this.subVillages = []; // Clear sub-villages
            this.router.navigate(['/all_camps']); // Navigate to a success page or wherever needed
          } else {
            this.toastr.error(response.msg, 'Error');
          }
        },
        (error) => {
          console.error('Error submitting Eye Screening Camp details:', error);
          this.toastr.error(error?.error?.msg || 'Something went wrong. Please try again', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill in all required fields.', 'Warning');
    }
  }
  // onSubmitEyeScreeningCamp(): void {
  //   if (this.eyeScreeningForm.valid) {

  //     const formData = this.eyeScreeningForm.value;
  //     this.eyeScreeningService.postEyeCampForm(formData).subscribe(
  //       (response) => {
  //         if (response.status === 'success') {
  //           this.toastr.success('Eye Screening Camp details submitted successfully!', 'Success');
  //           this.eyeScreeningForm.reset();
  //           this.subVillages = []; // Clear sub-villages
  //           this.router.navigate(['/all_camps']); // Navigate to a success page or wherever needed
  //         } else {
  //           this.toastr.error(response.msg, 'Error');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error submitting Eye Screening Camp details:', error);
  //         this.toastr.error(error?.error?.msg || 'Something went wrong. Please try again', 'Error');
  //       }
  //     );
  //   } else {
  //     this.toastr.warning('Please fill in all required fields.', 'Warning');
  //   }
  // }

  // HB Screening Camp Form------------------------------------------------------------------------

  onHBChange(): void {
    const hbValue = this.hbScreeningForm.get('HB')?.value;

    let HBReadings = '';
    if (hbValue >= 11 && hbValue <= 11.9) {
      HBReadings = 'Mild Anaemia';
    } else if (hbValue >= 8 && hbValue <= 10.9) {
      HBReadings = 'Moderate Anaemia';
    } else if (hbValue < 8) {
      HBReadings = 'Severe Anaemia';
    } else if (hbValue > 11.9) {
      HBReadings = 'Healthy (No Anaemia)';
    }

    this.hbScreeningForm.patchValue({
      HBReadings: HBReadings,
    });
  }

  onSubmitHBScreening(): void {
    if (this.hbScreeningForm.valid) {
      const formData = this.hbScreeningForm.value;

      // Replace the village ID with its corresponding name
      const selectedVillage = this.villages.find(village => village.id === +formData.village);
      if (selectedVillage) {
        formData.village = selectedVillage.name; // Set the village name instead of ID
      }

      // Now submit the formData object with village name
      this.hbScreeningService.postHBCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('HB Screening Camp details submitted successfully!', 'Success');
            this.hbScreeningForm.reset();
            this.subVillages = []; // Clear sub-villages
            this.router.navigate(['/all_camps']); // Navigate to a success page or wherever needed
          } else {
            this.toastr.error(response.msg, 'Error');
          }
        },
        (error) => {
          console.error('Error submitting HB Screening Camp details:', error);
          this.toastr.error(error?.error?.msg || 'Something went wrong. Please try again', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill in all required fields.', 'Warning');
    }
  }

  //Aarogya Dhansampada Camp-------------------------------------------------------------------------
  calculateBMI(): void {
    const weight = this.aarogyaCampForm.get('weight')?.value;
    const height = this.aarogyaCampForm.get('height')?.value;

    if (weight && height) {
      // Convert height from cm to meters for BMI calculation
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      this.aarogyaCampForm.get('bmi')?.setValue(bmi.toFixed(2));
      this.updateBMIStatus(bmi);
    }
  }

  updateBMIStatus(bmi: number): void {
    let bmiStatus = '';

    if (bmi < 18.5) {
      bmiStatus = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiStatus = 'Normal weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiStatus = 'Overweight';
    } else if (bmi >= 30) {
      bmiStatus = 'Obesity';
    }

    this.aarogyaCampForm.get('bmiStatus')?.setValue(bmiStatus);
  }

  onHBChangeAarogyaCamp(): void {
    const hbValue = this.aarogyaCampForm.get('hb')?.value;

    let HBReadings = '';
    if (hbValue >= 11 && hbValue <= 11.9) {
      HBReadings = 'Mild Anaemia';
    } else if (hbValue >= 8 && hbValue <= 10.9) {
      HBReadings = 'Moderate Anaemia';
    } else if (hbValue < 8) {
      HBReadings = 'Severe Anaemia';
    } else if (hbValue > 11.9) {
      HBReadings = 'Healthy (No Anaemia)';
    }

    this.aarogyaCampForm.patchValue({
      HBReadings: HBReadings,
    });
  }

  onSubmitAarogyaCamp(): void {
    if (this.aarogyaCampForm.valid) {
      console.log(this.aarogyaCampForm.value);
      // Logic to submit the form
    }
  }

  //Mega Camp------------------------------------------------------------------------------
  onSubmitMegaCamp(): void {
    if (this.megaCampForm.valid) {
      // Handle the form submission
      console.log(this.megaCampForm.value);
      // Implement your submission logic (e.g., API call)
    }
  }

}