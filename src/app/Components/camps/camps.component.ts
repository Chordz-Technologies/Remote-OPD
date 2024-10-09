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

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Eye Screening Camp
    this.eyeScreeningForm = this.fb.group({
      client_name: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contact: ['',],
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
      contact: ['',],
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
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      contactNo: ['',],
      mainVillage: ['', Validators.required],
      subVillage: ['', Validators.required],
      schoolName: ['',],
      standard: ['',],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      bmi: ['', Validators.required], // Auto-calculated BMI
      bmiStatus: ['', Validators.required], // Auto-populated BMI status
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
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      contactNo: ['',],
      mainVillage: ['', Validators.required],
      subVillage: ['', Validators.required],
      breastCancer: ['',],
      oralCancer: ['',],
      cervicalCancer: ['',],
      tbTest: ['',],
      description: ['',],
    });
    this.getVillages();
  }

  getVillages(): void {
    this.service.getAllVillages().subscribe((response: any) => {
      if (response.status === 'success') {
        this.villages = response.all_Villages;
      }
    });

    this.service.getClientNames().subscribe((response) => {
      if (response.status === 'success') {
        this.clients = response.all_clients;

        if (this.clients.length === 1) {
          const singleClientName = this.clients[0].client_name;
          this.eyeScreeningForm.get('client_name')?.setValue(singleClientName);
          this.hbScreeningForm.get('client_name')?.setValue(singleClientName);
          this.aarogyaCampForm.get('client_name')?.setValue(singleClientName);
          this.megaCampForm.get('client_name')?.setValue(singleClientName);
        }
      }
    });
  }

  onFileChange(event: any, form: FormGroup) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);

        // Map village name to corresponding id
        const selectedVillage = this.villages.find(v => v.name === jsonData.village);
        if (selectedVillage) {
          jsonData.village = selectedVillage.id; // Set the id of the village
          this.onMainVillageChange({ target: { value: selectedVillage.id } }); // Trigger village change to populate sub-villages

          // Set the sub-village if it exists
          if (selectedVillage.vnames.includes(jsonData.villageName)) {
            form.patchValue({ villageName: jsonData.villageName });
          }
        }
        form.patchValue(jsonData);
      };
      reader.readAsText(file);
    }
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
      this.eyeScreeningForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
      });
      this.hbScreeningForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
      });
      this.aarogyaCampForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
      });
      this.megaCampForm.patchValue({
        day: dayOfWeek,
        month: month,
        year: year,
      });
    }
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
      this.service.postEyeCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Eye Screening Camp details submitted successfully!', 'Success');
            const clientName = this.eyeScreeningForm.get('client_name')?.value;
            this.eyeScreeningForm.reset();
            this.eyeScreeningForm.patchValue({ client_name: clientName });
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
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }

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
      this.service.postHBCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('HB Screening Camp details submitted successfully!', 'Success');
            const clientName = this.eyeScreeningForm.get('client_name')?.value;
            this.hbScreeningForm.reset();
            this.hbScreeningForm.patchValue({ client_name: clientName });
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
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }

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
      const formData = this.aarogyaCampForm.value;

      // Replace the village ID with its corresponding name
      const selectedVillage = this.villages.find(village => village.id === +formData.village);
      if (selectedVillage) {
        formData.village = selectedVillage.name; // Set the village name instead of ID
      }

      // Now submit the formData object with village name
      this.service.postAarogyaCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Aarogya Dhansampada Camp details submitted successfully!', 'Success');
            const clientName = this.aarogyaCampForm.get('client_name')?.value;
            this.aarogyaCampForm.reset();
            this.aarogyaCampForm.patchValue({ client_name: clientName });
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
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }

  onSubmitMegaCamp(): void {
    if (this.megaCampForm.valid) {
      const formData = this.megaCampForm.value;

      // Replace the village ID with its corresponding name
      const selectedVillage = this.villages.find(village => village.id === +formData.village);
      if (selectedVillage) {
        formData.village = selectedVillage.name; // Set the village name instead of ID
      }

      // Now submit the formData object with village name
      this.service.postMegaCampForm(formData).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.toastr.success('Mega Camp details submitted successfully!', 'Success');
            const clientName = this.megaCampForm.get('client_name')?.value;
            this.megaCampForm.reset();
            this.megaCampForm.patchValue({ client_name: clientName });
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
      this.toastr.error('Please fill all required fields.', 'Error');
    }
  }
}