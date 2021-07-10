import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  today: moment.Moment = moment().hour(0).minute(0).second(0);
  selectedDate: moment.Moment = moment(this.today);
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
      let input = moment(`${this.selectedDate.year()}-${this.selectedDate.month()+1}-${i+1}`, 'YYYY-MM-DD').hour(0).minute(0).second(0);
      output[week].push({
        day: input.date(),
        isBefore: input.isBefore(this.today, 'day'),
        isToday: input.isSame(this.today, 'day')
      });
    }

    // Finally, I add empty cells at the end of the last row if it isn't of length 7.
    while (output[week].length < 7) {
      output[week].push('');
    }
    this.days = output;
  }

  /**
   * @param flag (boolean) when true, indicates navigation to the next month. Else, will navigate to the previous.
   * ```typescript
   * navigateMonth(true); // Takes you to next month.
   * navigateMonth(false); // Takes you to previous month.
   * ```
   * Don't be intimidated by this unnecessary comment. I'm trying this out to see how things work.
   */
  navigateMonth(flag: boolean) {

    let compare = flag ? 11 : 0;
    let offset = flag ? 1 : -1;
    let nextMonth = flag ? 0 : 11;

    if (this.selectedDate.month() == compare)
      this.selectedDate.year(this.selectedDate.year() + offset).month(nextMonth);
    else
      this.selectedDate.month(this.selectedDate.month() + offset);
    
    this.divideIntoWeeks();
  }

}
