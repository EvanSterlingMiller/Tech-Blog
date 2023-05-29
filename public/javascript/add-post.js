async function newFormHandler(event) {
    event.preventDefault();
    const title = document.querySelector('input[name="post-title"]').value;
    const post_content = document.querySelector('textarea[name="post-content"]').value;
    console.log(title)
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.post-new-form').addEventListener('submit', newFormHandler);