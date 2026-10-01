# from app.ai.image.schemas import (
#     CreativeBrandContext,
#     CreativeBrief,
#     CreativeDesignContext,
#     CreativeSourceContent,
# )
# from app.models.project import Project
# from app.schemas.image_generation import (
#     CreateImageGenerationRequest,
# )


# class CreativeBriefBuilder:

#     def build(
#         self,
#         *,
#         project: Project,
#         source: CreativeSourceContent,
#         data: CreateImageGenerationRequest,
#         logo_url: str | None = None,
#         primary_image_urls: list[str] | None = None,
#         reference_image_urls: list[str] | None = None,
#     ) -> CreativeBrief:

#         supporting_text = [
#             *source.supporting_text,
#         ]

#         if data.subheadline:
#             supporting_text.append(
#                 data.subheadline
#             )

#         if data.price_text:
#             supporting_text.append(
#                 data.price_text
#             )

#         if data.promo_text:
#             supporting_text.append(
#                 data.promo_text
#             )

#         source_content = CreativeSourceContent(
#             # User override wins.
#             # Otherwise this remains source/reference material
#             # for the creative model to intelligently distill.
#             title=(
#                 data.headline
#                 or source.title
#             ),
#             body=source.body,
#             call_to_action=(
#                 data.call_to_action
#                 or source.call_to_action
#             ),
#             supporting_text=(
#                 supporting_text
#             ),
#             hashtags=(
#                 source.hashtags
#             ),
#         )

#         brand_context = (
#             CreativeBrandContext(
#                 brand_name=data.brand_name,
#                 tagline=data.tagline,
#                 brand_colors=(
#                     data.brand_colors
#                 ),
#                 logo_url=logo_url,
#                 whatsapp=data.whatsapp,
#                 phone=data.phone,
#                 instagram=data.instagram,
#                 tiktok=data.tiktok,
#                 twitter=data.twitter,
#                 facebook=data.facebook,
#                 website=data.website,
#                 address=data.address,
#             )
#         )

#         design_context = (
#             CreativeDesignContext(
#                 language=(
#                     data.source_language
#                 ),
#                 platform=(
#                     data.source_variant
#                 ),
#                 objective=(
#                     project.objective.value
#                     if project.objective
#                     else None
#                 ),
#                 tone=(
#                     project.tone.value
#                     if project.tone
#                     else None
#                 ),
#                 audience=(
#                     project.audiences
#                     or []
#                 ),
#                 design_style=(
#                     data.design_style.value
#                     if data.design_style
#                     else None
#                 ),
#                 format=(
#                     data.format.value
#                     if data.format
#                     else None
#                 ),
#                 design_notes=(
#                     data.design_notes
#                 ),
#                 include_hashtags=(
#                     data.include_hashtags
#                 ),
#             )
#         )

#         return CreativeBrief(
#             source=source_content,
#             brand=brand_context,
#             design=design_context,
#             primary_image_urls=(
#                 primary_image_urls
#                 or []
#             ),
#             reference_image_urls=(
#                 reference_image_urls
#                 or []
#             ),
#         )


from app.ai.image.schemas import (
    CreativeBrandContext,
    CreativeBrief,
    CreativeDesignContext,
    CreativeSourceContent,
)
from app.models.project import Project
from app.schemas.image_generation import (
    CreateImageGenerationRequest,
)


class CreativeBriefBuilder:

    def build(
        self,
        *,
        project: Project,
        source: CreativeSourceContent,
        data: CreateImageGenerationRequest,
        logo_url: str | None = None,
        primary_image_urls: list[str] | None = None,
        reference_image_urls: list[str] | None = None,
    ) -> CreativeBrief:

        is_custom_design = (
            self._is_custom_design(
                data
            )
        )

        source_content = CreativeSourceContent(
            title=(
                data.headline
                or source.title
            ),
            body=source.body,
            subheadline=(
                data.subheadline
            ),
            call_to_action=(
                data.call_to_action
                or source.call_to_action
            ),
            price_text=(
                data.price_text
            ),
            promo_text=(
                data.promo_text
            ),
            supporting_text=[
                *source.supporting_text,
            ],
            hashtags=[
                *source.hashtags,
            ],
        )

        brand_context = (
            CreativeBrandContext(
                brand_name=(
                    data.brand_name
                ),
                tagline=(
                    data.tagline
                ),
                brand_colors=[
                    *data.brand_colors
                ],
                logo_url=logo_url,
                whatsapp=data.whatsapp,
                phone=data.phone,
                instagram=data.instagram,
                tiktok=data.tiktok,
                twitter=data.twitter,
                facebook=data.facebook,
                website=data.website,
                address=data.address,
            )
        )

        design_context = (
            CreativeDesignContext(
                language=(
                    data.source_language
                ),
                platform=(
                    data.source_variant
                ),
                objective=(
                    project.objective.value
                    if project.objective
                    else None
                ),
                tone=(
                    project.tone.value
                    if project.tone
                    else None
                ),
                audience=(
                    project.audiences
                    or []
                ),
                design_style=(
                    data.design_style.value
                    if data.design_style
                    else None
                ),
                format=(
                    data.format.value
                    if data.format
                    else None
                ),
                design_notes=(
                    data.design_notes
                ),
                include_hashtags=(
                    data.include_hashtags
                ),
                is_custom_design=(
                    is_custom_design
                ),
            )
        )

        return CreativeBrief(
            source=source_content,
            brand=brand_context,
            design=design_context,
            primary_image_urls=(
                primary_image_urls
                or []
            ),
            reference_image_urls=(
                reference_image_urls
                or []
            ),
        )

    @staticmethod
    def _is_custom_design(
        data: CreateImageGenerationRequest,
    ) -> bool:

        design_style = (
            data.design_style.value
            if data.design_style
            else None
        )

        image_format = (
            data.format.value
            if data.format
            else None
        )

        return any(
            [
                data.brand_name,
                data.tagline,
                data.brand_colors,

                data.headline,
                data.subheadline,
                data.call_to_action,
                data.price_text,
                data.promo_text,

                data.whatsapp,
                data.phone,
                data.instagram,
                data.tiktok,
                data.twitter,
                data.facebook,
                data.website,
                data.address,

                data.design_notes,

                data.logo_asset_uid,
                data.primary_asset_uids,
                data.reference_asset_uids,

                data.include_hashtags,

                (
                    design_style
                    and design_style != "auto"
                ),

                (
                    image_format
                    and image_format != "auto"
                ),
            ]
        )