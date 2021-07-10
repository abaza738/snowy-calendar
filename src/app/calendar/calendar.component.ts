import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  today: moment.Moment = moment();
  selectedDate: moment.Moment = this.today;
  daysOfWeek = moment.weekdaysMin(true);
  startOfMonth: number = 0;
  days: any[] = [];
  round = Math.round;

  constructor() { }

  ngOnInit(): void {
    this.divideIntoWeeks();
  }

  counter(i: number) {
    return Array(i);
  }

  async divideIntoWeeks() {

    // Easy way to get the day at which the month starts -> moment.js provides it x)
    this.startOfMonth = moment(this.selectedDate).startOf('month').day();

    // Not to mention the amount of days in the month ↓
    let allDays = this.selectedDate.daysInMonth();
    let output: any = [[]];

    // Padding until start of month with empty cells
    for (let i = 0; i < this.startOfMonth; i++)
      output[0].push('');

    // week will be the row aka week counter
    let week = 0;

    /**
     * Now for the main loop
     * Iterating through each day of the month,
     * I continue filling from the padded first row.
     * When it reaches 7 entries, I open a new row.
     */
    for (let i = 0; i < allDays; i++) {
      if (!output[week] || output[week].length % 7 == 0) {
        output.push([]);
        week++
      }
      let input = moment(`${this.selectedDate.year()}-${this.selectedDate.month()+1}-${i+1}`);
      output[week].push({
        day: input.date(),
        isBefore: this.today.dayOfYear() > input.dayOfYear(),
        isToday: this.today.dayOfYear() == input.dayOfYear()
      });
    }

    // Finally, I add empty cells at the end of the last row if it isn't of length 7.
    while (output[week].length < 7) {
      output[week].push('');
    }
    this.days = output;
  }

  previousMonth() {
    this.selectedDate = moment().month(this.selectedDate.month() - 1);
    this.ngOnInit();
  }
  
  nextMonth() {
    this.selectedDate = moment().month(this.selectedDate.month() + 1);
    this.ngOnInit();
  }

}
