# User Authentication & Feedback Flow

## 🔐 How to Login/Register

### For New Users:
1. **On the Welcome Page**, look at the top-right corner
2. Click the **"Login / Sign Up"** button
3. You'll be taken to the **Login Page**
4. Click **"Sign up"** at the bottom to create an account
5. Fill in:
   - Your name
   - Email address
   - Password
6. Click **"Sign Up"**
7. You'll be automatically redirected to login
8. Enter your credentials and click **"Sign In"**

### For Returning Users:
1. **On the Welcome Page**, click **"Login / Sign Up"** in the top-right
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be taken back to the Welcome Page, now logged in!

---

## ✨ What You Get When Logged In

### 1. **Activity History Tracking**
- Every place you select is automatically saved
- View past activities by clicking the History icon (top-right)
- See the weather and environmental conditions at the time

### 2. **Location Feedback System**
- After visiting a place, share your real experience
- Rate the place (1-5 stars)
- Report if conditions were accurate
- Share safety feedback (safe/caution/unsafe)
- Write comments to help others

### 3. **Community Reviews**
- See what other users say about places
- View average ratings and safety breakdowns
- Read recent comments from visitors
- Check prediction accuracy percentage

---

## 📍 How to Give Feedback

### Step-by-Step:
1. **Select an activity** (e.g., "Hiking" or "Shopping")
2. **Choose a place** from the suggestions
3. **View the place details**
4. After visiting (or if you know the place), scroll down
5. Click **"Share Your Experience"** button
6. Fill out the feedback form:
   - ⭐ Rate your experience (1-5 stars)
   - 👍/👎 Were the conditions accurate?
   - 🛡️ How safe was it? (Safe/Caution/Unsafe)
   - 💬 Add comments (optional)
7. Click **"Submit Feedback"**
8. Done! Your feedback helps the community

---

## 🎯 User Flow Diagram

```
Welcome Page (Not Logged In)
    │
    ├─→ Click "Login / Sign Up" button
    │
    └─→ Login Page
         │
         ├─→ Click "Sign up" → Register Page
         │                         │
         │                         └─→ Fill form → Success → Back to Login
         │
         └─→ Enter credentials → Sign In → Welcome Page (Logged In)
                                               │
                                               ├─→ History icon → View Past Activities
                                               │
                                               └─→ Select Activity → Choose Place
                                                                         │
                                                                         └─→ "Share Your Experience"
                                                                                  │
                                                                                  └─→ Submit Feedback
```

---

## 💡 Why Login is Worth It

### Without Login:
- ✓ View activity recommendations
- ✓ See place suggestions
- ✓ Check environmental conditions
- ✗ No history tracking
- ✗ Can't share feedback
- ✗ Can't see community reviews

### With Login:
- ✓ Everything above, PLUS:
- ✓ Track all your activities
- ✓ Share feedback on places
- ✓ See community reviews
- ✓ Help others make safe decisions
- ✓ Build your activity history

---

## 🔒 Security

- Passwords are securely hashed
- Authentication handled by Supabase Auth
- Email confirmation is automatically enabled
- Access tokens are used for secure API calls
- User data is private and protected

---

## 🆘 Troubleshooting

**Can't find the Login button?**
- Look at the top-right corner of the Welcome Page
- It says "Login / Sign Up"

**Forgot your password?**
- Currently, password reset is not implemented
- You can create a new account with a different email

**Already have an account but on Login page?**
- Just click "Sign in" at the bottom

**Want to switch from Register to Login?**
- Click "Sign in" at the bottom of the Register page

---

## 📱 Mobile Experience

The entire app is mobile-first and works perfectly on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop computers

All features, including login and feedback, are fully responsive!
