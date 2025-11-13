def next_id(collection):
    if not collection:
        return 1
    return max(item['id'] for item in collection) + 1
