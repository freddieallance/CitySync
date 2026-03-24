# 🏆 Trusted Reviewer System

## Overview

The Trusted Reviewer System is a gamified community-driven feedback platform that rewards users for providing accurate, helpful location feedback. Users can earn badges, build reputation, and become recognized as trusted sources of real-time safety information.

---

## 🎯 Key Features

### 1. **Real-Time Location Feedback with Photos**
Users can share their actual experience at locations including:
- ⭐ Star rating (1-5)
- 📸 Photo upload (current conditions)
- ✅ Prediction accuracy (were conditions as expected?)
- 🛡️ Actual safety level (safe/caution/unsafe)
- 💬 Written comments (up to 500 characters)

### 2. **Photo Upload System**
- **Supported formats**: JPEG, PNG, WebP
- **Max file size**: 5MB
- **Secure storage**: Supabase Storage with signed URLs
- **Purpose**: Show real-time conditions at locations

### 3. **Community Rating System**
- Other users can rate feedback as "Helpful" 👍 or "Not Helpful" 👎
- Prevents duplicate voting
- Users cannot rate their own feedback
- Votes contribute to the reviewer's reputation

### 4. **Badge System**
Users earn badges based on their contribution and accuracy:

| Badge | Requirements | Benefits |
|-------|-------------|----------|
| 🌟 **Contributor** | 5+ reviews, 60%+ accuracy | Entry-level recognition |
| 🛡️ **Trusted Reviewer** | 10+ reviews, 75%+ accuracy | Green shield badge |
| 🏅 **Expert** | 25+ reviews, 85%+ accuracy | Purple award badge |
| 🏆 **Legendary** | 50+ reviews, 90%+ accuracy | Gold trophy badge + highest trust |

### 5. **Reputation Score**
- **Calculated from**: Helpful votes ÷ Total votes × 100
- **Displayed**: Next to user's name in reviews
- **Impact**: Higher reputation = more trusted feedback

### 6. **User Profile Dashboard**
View comprehensive stats including:
- Total reviews submitted
- Helpful votes received
- Current accuracy score
- Current badge level
- Progress to next badge
- Badge system guide

---

## 🔄 How It Works

### For Feedback Providers:

1. **Visit a Location**
   - Select activity and place
   - Get directions via Google Maps

2. **Share Your Experience**
   - Click "Share Your Experience" button
   - Rate overall experience (1-5 stars)
   - Upload a photo of current conditions (optional)
   - Report if predictions were accurate
   - Select actual safety level
   - Add detailed comments

3. **Build Reputation**
   - Other users vote on your feedback
   - Earn badges as you provide quality feedback
   - Track progress in your profile

### For Feedback Consumers:

1. **View Community Reviews**
   - See average ratings and safety breakdown
   - Read recent reviews with photos
   - Check reviewer badges (trusted sources)
   - View prediction accuracy percentage

2. **Rate Others' Feedback**
   - Mark helpful feedback with 👍
   - Mark unhelpful feedback with 👎
   - Help identify quality contributors

---

## 📊 Reputation Calculation

```
Accuracy Score = (Helpful Votes ÷ Total Votes) × 100

Example:
- 45 helpful votes
- 5 not helpful votes
- Total = 50 votes
- Accuracy = (45 ÷ 50) × 100 = 90%
```

### Badge Assignment Logic:
```javascript
if (reviews >= 50 && accuracy >= 90) → Legendary
else if (reviews >= 25 && accuracy >= 85) → Expert
else if (reviews >= 10 && accuracy >= 75) → Trusted
else if (reviews >= 5 && accuracy >= 60) → Contributor
else → None
```

---

## 🎨 Visual Elements

### Badge Display:
- **Icon + Label** in user profiles
- **Icon only** next to usernames in reviews (hover for details)
- **Color-coded**:
  - Gray: New User
  - Blue: Contributor
  - Green: Trusted Reviewer
  - Purple: Expert
  - Gold gradient: Legendary

### Safety Indicators:
- 🟢 **Safe** - Green badge
- 🟡 **Caution** - Yellow badge
- 🔴 **Unsafe** - Red badge

---

## 📱 User Journey

### First Time User:
```
Login/Register → Select Activity → Choose Place → Visit Location →
Share Feedback → Upload Photo → Submit → Wait for Votes →
Earn Contributor Badge (after 5 reviews)
```

### Experienced User:
```
View Profile → See 25 reviews, 88% accuracy →
Current: Expert Badge → Progress: 50% to Legendary →
Submit More Feedback → Maintain High Quality →
Earn Legendary Badge
```

---

## 🔒 Security & Integrity

### Photo Upload Security:
- ✅ File type validation (JPEG/PNG/WebP only)
- ✅ File size limit (5MB max)
- ✅ Private storage bucket
- ✅ Signed URLs (1-year validity)
- ✅ User authentication required

### Vote Integrity:
- ✅ One vote per user per feedback
- ✅ Cannot vote on own feedback
- ✅ Vote tracking to prevent duplicates
- ✅ Immutable vote history

### Data Storage:
- **Feedback**: Key-value store by place name
- **User Reputation**: Key-value store by user ID
- **Vote Tracking**: Key-value store by vote ID
- **Photos**: Supabase Storage bucket

---

## 🎁 Benefits

### For Individual Users:
- 🏆 Recognition and badges
- 📊 Track contribution history
- ⭐ Build reputation
- 🎯 Help your community
- 📸 Share real conditions

### For the Community:
- ✅ More accurate predictions
- 🔍 Real-time condition updates
- 🛡️ Safety warnings from locals
- 📷 Visual confirmation of conditions
- 🤝 Collaborative safety network

### For Place Recommendations:
- 📈 Community-validated safety scores
- 💯 Accuracy metrics
- 🌟 Trusted reviewer endorsements
- 📸 Real photos vs. stock images
- ⚡ Live condition updates

---

## 📈 Statistics Tracked

### Per User:
- Total feedback submitted
- Helpful votes received
- Not helpful votes received
- Accuracy score (%)
- Current badge level
- Review history

### Per Place:
- Total reviews
- Average rating
- Safety breakdown (safe/caution/unsafe)
- Prediction accuracy %
- Recent reviews with photos
- Reviewer badge distribution

### Per Feedback:
- Helpful count
- Not helpful count
- Photo URL
- Timestamp
- Author badge level
- Author reputation score

---

## 🚀 Future Enhancements

Potential additions:
- 📍 Real-time location verification (prove you're there)
- 🏅 Monthly top reviewer leaderboard
- 🎁 Rewards for highly-rated contributors
- 📧 Notifications when feedback is rated
- 🔔 Alerts for places you've reviewed
- 📊 Detailed analytics dashboard
- 🌍 Regional expert badges
- ⏰ Time-sensitive warnings

---

## 💡 Best Practices

### For Providing Quality Feedback:
1. **Be honest** - Accurate reports build trust
2. **Add photos** - Visual proof is powerful
3. **Be detailed** - Specific comments help others
4. **Be timely** - Report conditions quickly
5. **Be respectful** - Constructive feedback only

### For Rating Others' Feedback:
1. **Be fair** - Consider accuracy and helpfulness
2. **Be consistent** - Use same standards for all
3. **Be thoughtful** - Don't downvote personal opinions
4. **Be appreciative** - Reward quality contributions

---

## 🎯 Success Metrics

### Engagement:
- Number of reviews per day
- Photo upload rate
- Vote participation rate
- Badge progression rate

### Quality:
- Average accuracy scores
- Helpful vote ratio
- Review length and detail
- Photo quality submissions

### Impact:
- Prediction accuracy improvement
- User safety awareness
- Community trust building
- Active trusted reviewers

---

## 🌟 Why This Matters

The Trusted Reviewer System transforms passive users into active community contributors. By combining:
- **Gamification** (badges, scores, progression)
- **Social proof** (votes, reputation)
- **Visual validation** (photos)
- **Recognition** (badges, profiles)

...we create a self-sustaining ecosystem where:
1. Users are motivated to contribute
2. Quality feedback is rewarded
3. Community trust is built
4. Safety information improves
5. Everyone benefits

---

## 📞 API Endpoints

### Upload Photo:
```
POST /make-server-0765a8f0/upload-feedback-photo
Headers: Authorization: Bearer {token}
Body: FormData with 'photo' file
Returns: { photoUrl, photoPath }
```

### Submit Feedback:
```
POST /make-server-0765a8f0/feedback
Headers: Authorization: Bearer {token}
Body: { placeName, rating, photoUrl, ... }
Returns: { success: true, feedbackId }
```

### Rate Feedback:
```
POST /make-server-0765a8f0/rate-feedback
Headers: Authorization: Bearer {token}
Body: { feedbackId, placeName, isHelpful }
Returns: { success: true, newHelpfulCount, newNotHelpfulCount }
```

### Get User Reputation:
```
GET /make-server-0765a8f0/user-reputation/{userId}
Returns: { totalFeedback, helpfulVotes, accuracyScore, badge }
```

### Get Place Feedback:
```
GET /make-server-0765a8f0/feedback/{placeName}
Returns: { totalReviews, averageRating, recentFeedback[], ... }
```

---

## 🎨 UI Components

### UserBadge Component:
- Displays badge icon and label
- Tooltip with badge requirements
- Color-coded by level
- Reusable across app

### FeedbackDialog Component:
- Star rating selector
- Photo upload with preview
- Safety level selector
- Comment textarea
- Loading states

### UserProfilePage Component:
- Stats dashboard
- Current badge display
- Progress to next badge
- Badge guide
- Tips for improvement

---

This system creates a win-win-win scenario: users get recognition, the community gets better data, and everyone stays safer! 🎉
