--Readme document for Jae Oh, jaeyo@uci.edu, 41812159, Nathan McLaughlin, namclaug@uci.edu, 60824328--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
30 hours


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://ionicframework.com/docs
https://ionic.io/ionicons
https://angular.dev


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
n/a


5. Is there anything special we need to know in order to run your code?
No, just the standard "ionic serve" should work.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
Please view the app in devtools with an iPhone 16 device selected, it was intended for an ios
user.


7. Did you design your app specifically for iOS or Android, or both?
Ios, followed conventions like logbook button/save on the top right and then back/cancel button on the left.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

On the home page, the two buttons at the bottom allow users to track overnight sleep and sleepiness respectively. A brief form shows up, where
the user picks a date and time for when they woke up and when they went to bed. We choose this design since when the user opens the app, there's
a good chance they are going to log one of those two things, so putting it on the home page makes it quite convinient for them.
We also decided to allow users to log overnight sleep on the logbook page. To do this, users can click on the clock (for sleep) or battery (for sleepiness)
in the top right corner. We decided to also put this feature on the logbook page in case the user wanted to update any data while looking at the logs.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

On the logbook page, the battery button opens a form with a 1-7 slider with Stanford sleepiness description. We felt that it
belonged on the logbook page so that they could choose to log it while looking at previous data.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

The home screen shows data with relevant and calculated averages for the past week.
They can also view it on the logbook in detail and scroll through all the previous data, this was chosen to support viewing all the data
If the user chose to.


11. Which feature choose--using a native device resource, backing up logged data, or both?

We choose backing up logged data. This is because if we were actually using this app, we thought the more
crucial thing would be to have our data saved. We decided to use ionic-storage based on its simpleness as
shown from the in-class demo.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

N/A


13. If you backed up logged data, where does it back up to?

It backs up to ionic-storage. We choose this because of the write up on the assignment,
combined with the fact that the professor made the in-class demo seem pretty simple.
We did not want to have to deal with using SQL, thus we opted for this option.


14. How does your app implement or follow principles of good mobile design?

- deleting logs in red trash icon as an "uh-oh" button"
- relevant informational data cards on homepage for "initial view"
- error prevention by blocking times that are unrealistic (negative sleep or too much sleep)
- used ios conventions
- the two buttons on the home screen are placed near the bottom, which is the spot the thumb naturally goes to
