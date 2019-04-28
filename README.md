# Project for Vibe Music Indy 
Working on Handling Calendar information on google calendars and google sheets in order to simplify invoicing

### top priorities as of 04/06/2019
1. google form for instructor calendars
2. quickbooks integration 

### quickbooks integration 
- figure out quickbooks API 
- john has a "quickbooks online account" 
- ideal situation would be for someone to receive an invoice the 
day after their last lesson of each month, different for 
different clients
- look into triggers, triggering based on changes in 
calendars 

### google form for instrcutors
- end of day with lessons, email instructor and ask if the lesson 
happened
- run the script at like 9:05pm 
- based on their responses, it would update the calendar 
- possibly reformat calendar inputs for them 
- create a situation wehre a new form is not created every time 
the script runs, but instead there is maybe one form per 
instructor? 
- ask one question for each lesson that is on the calendar during 
that time frame
- "Looking at" + exact title of event on calendar, and tehn ask 
if that is accurate yes or no
- if they put no, it gives follow up question
- change items change duration, travel fee, cancellation (either 
before today or same day cancellation and not due to sickness or 
emergency), no show (same day cancellation without good reason 
or legit now show), free trial  
- whenver a modification is checked, give them that thing
- respond again and show the outcome of that box being checked 
- list everything as a "session" not a "lesson" in the end 
- make whole thing responsive so it responds to questions
- add functionality to handle if instrcutor doesn
't respond 
- use the notes section of the calendar to track if the thing 
has been modified or shoudl be added to the "to do list" 

### email to clients
- subject "your lesson report" 
- last month you had this many lessions
- next month you hve this many lessons
- is this correct? y/n
- figure out a way to make the URL click or embed a form in the email
- ideally the yes or no should be in the body of the email 
- actually maybe they don't even click yes, only a "no" otherwise they can just ignore it 
- would it be acceptable to just have multiple links that open up emails 
to the correct instructors? that's def doable
- some other form integration that creates teh form just in time? idk 
could be too trick and slow 

### integration of client emails and scanning calendar
- these scripts are doing a lot of the same work, should integration 
their shared functions
- find instructor in master roster
- opening calendars / removing unwanted calendars
- generating meta data for events within a window 
- 
