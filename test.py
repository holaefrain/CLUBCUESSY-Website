count = 0
for i in range(10,0,-2):
    count += i
myList = [x/2 for x in range(100)]
print(myList[count])

# Dictionary of Sindarin words
dictionary = {"twilight": "aduial", "heirloom": "advir", "father": "adar", "mother": "emel"}

while True:
    # ask the user for an English word
    english_word = input("Enter a word in English: ")
    (english_word + dictionary[english_word] * 2)
    # search for the word in our dictionary
    if english_word.lower() in dictionary:
        elvish_word = dictionary[english_word]
    else:
        elvish_word = "???"
    print(elvish_word)

        
    (english_word + dictionary[english_word] * 2))


books = ['Nephi', 'Jacob', 'Enos', 'Jarom']
prophet = books
writers = books[:]
brothers = books[0:2]
prophet.append('Omni')

filename = 'my_fav_classes.txt'
with open(filename, 'w') as file:
    file.write('CS 111')
    
int = 3
user_int = int(input(f"Enter an integer to multiple by {int}: "))
print(f'The result is: {int} * {user_int}')
