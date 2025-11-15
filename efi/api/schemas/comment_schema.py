# schemas/comment_schema.py
from marshmallow import Schema, fields

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    content = fields.Str(required=True)
    post_id = fields.Int(required=True)
    user_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
