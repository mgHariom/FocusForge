
export const signUp = async (user) => {
    const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.message || 'failed to sign up');
    return data;
};