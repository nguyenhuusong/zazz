import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import { dateFormatter } from 'src/app/utils/common/function-common';
import * as moment from 'moment';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-chon-lich-hop',
  templateUrl: './chon-lich-hop.component.html',
  styleUrls: ['./chon-lich-hop.component.scss']
})
export class ChonLichHopComponent implements OnInit, OnChanges {
  @Input() meetingInfo = {
    roomId: '',
    floorNo: '',
    meet_at: '',
    filter: ''
  };
  @Output() chooseTime = new EventEmitter<any>();
  @Output() chooseDate = new EventEmitter();
  @Output() handleBack = new EventEmitter();
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions;
  calendarApi: Calendar;
  showChooseDate = false;

  constructor(
    private apiService: ApiService
  ) {
    
    this.calendarOptions = {
      dateClick: (info) => {
        // const getDay = new Date();
        // if (info.dateStr >= moment(getDay).format('YYYY-MM-DD')) {
        //   const formDate = new Date(info.dateStr);
        //   this.fromDate = formDate;
        //   if (this.data.map(s => s.date).indexOf(info.dateStr) > -1) {
        //     this.handleRemove(info);
        //   } else {
        //     this.checkDisabelDays(info.dateStr);
        //   }
        // }
        // this.showChooseDate = true;
      },
      locale: 'vi',
      titleFormat: function () {
        return 'Lịch làm việc';
      },
      customButtons: {
        myCustomButton: {
          text: moment().format('MMM DD, YYYY')
          // text: ''+currentDate,
        }
      },
      headerToolbar: {
        left: 'myCustomButton prev today next',
        center: '',
        right: 'dayGridMonth, timeGridWeek, dayGridDay'
      },
      buttonText: { today: "Hôm nay" },
      views: {
        today: {
          buttonText: 'Hôm nay'
        },
        dayGridMonth: {
          buttonText: 'Tháng'
        },
        timeGridWeek: {
          buttonText: 'Tuần'
        },
        dayGridDay: {
          buttonText: 'Ngày'
        },
      },
      displayEventTime: true,
      editable: false,
      selectable: true,
      selectMirror: false,
      plugins: [ timeGridPlugin ],
      // timeGridWeek
      initialView: 'dayGridMonth',
      eventMinHeight: 120,
      slotEventOverlap: false,
      allDayText: '',
      slotDuration: '00:30:00', // Bao nhiêu phút thì tách thành 1 khoảng thời gian
      scrollTime: '10:00:00',
      eventTimeFormat: { // like '14:30:00'
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
        // hour12: false
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      },
      eventContent: function (arg) {
        var event = arg.event;
        return { html: `
          <div class="custom-event-label p-1" style="width: '100%'">
            <div class="text-bold"><b>${event.extendedProps.meetname}</b></div>
            <div class = "grid">
              <div class="col-6">
                <span>${event.title}</span>
              </div>
              <div class="col-6 text-right">
                <span>${event.start.getHours() + ':' + event.start.getMinutes()}</span> -  <span>${event.end.getHours() + ':' + event.start.getMinutes()}</span>
              </div>
            </div>
          <div>
        ` }
      },
      events: []
    };
  }


  currentDate = null
  test() {
    // console.log(this.calendarApi.getCurrentData());
    this.currentDate = this.calendarApi?.getDate()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.meetingInfo && this.meetingInfo.roomId && this.meetingInfo.floorNo) {
      const queryParams = queryString.stringify(this.meetingInfo);
      this.apiService.getMeetRoomForCheck(queryParams)
      .subscribe(response => {
        response.data.map(t => this.convertDataToEvent(t)).forEach(t => {
          this.calendarApi.addEvent(t);
        })
      });
    }
  }

  // getMinuteBetweenTwoTime(startTime: string, endTime: string) {
  //   var time_start: Date = new Date();
  //   var time_end: Date = new Date();
  //   var value_start = startTime.split(':');
  //   var value_end = endTime.split(':');

  //   time_start.setHours(+value_start[0], +value_start[1], +value_start[2], 0)
  //   time_end.setHours(+value_end[0], +value_end[1], +value_end[2], 0)

  //   return (time_end - time_start) / 360000;
  // }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  convertDataToEvent(data) {
    return {
      meetname: data.meet_name || '--',
      title: data.room_name || '--',
      start: data.meet_at ? new Date(data.meet_at) : null,
      end: data.meet_at ? this.addMinutes(new Date(data.meet_at), data.meet_time) : null,
      resourceId: data.roomId || '--'
    };
  }
  ngOnInit(): void {
    this.currentDate = this.calendarApi?.getDate();
    this.test();
  }

  ngAfterViewChecked(): void {
    this.calendarApi = this.calendarComponent.getApi();
  }

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }

  handleAdd(): void {
    this.showChooseDate = true;
  }

  handleChooseTime(data): void {
    this.showChooseDate = false;
    this.chooseDate.emit(data);
    // let calendarApi = this.calendarComponent.getApi();
    // calendarApi.addEvent({
    //    title: 'Chào cụ' + (new Date()).getTime(),
    //    start: new Date(),
    //    end: new Date(),
    //    resourceId: 1
    //  });
  }

  back(): void {
    this.handleBack.emit();
  }

  goBack() {
    this.chooseDate.emit(false);
  }
}
